import * as halfred from 'halfred';
import * as qs from 'querystring';
import * as ShiroTrie from 'shiro-trie';
import * as superagent from 'superagent';
import * as validator from 'json-schema-remote';

import Core, { environment } from './Core';
import EntryList, { createList } from './resources/publicAPI/EntryList';
import EntryResource, { createEntry } from './resources/publicAPI/EntryResource';
import PublicAssetList from './resources/publicAPI/PublicAssetList';
import PublicAssetResource from './resources/publicAPI/PublicAssetResource';
import { filterOptions } from './resources/ListResource';
import {
  get,
  getEmpty,
  getSchema,
  getUrl,
  optionsToQuery,
  post,
  superagentFormPost,
  superagentGet,
  superagentPost
} from './helper';

const resourceSymbol = Symbol.for('resource');
const tokenStoreSymbol = Symbol.for('tokenStore');
const traversalSymbol = Symbol.for('traversal');
const eventsSymbol = Symbol.for('events');
const environmentSymbol = Symbol.for('environment');

const shortIDSymbol = Symbol('_shortID');
const modelCacheSymbol = Symbol('_modelCache');
const permissionsSymbol = Symbol('_permissionsSymbol');
const permissionsLoadedTimeSymbol = Symbol('_permissionsLoadedTimeSymbol');
const assetBaseURLSymbol = Symbol('assetBaseURL');

validator.setLoggingFunction(() => {
});

const urls = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  nightly: 'https://datamanager.buffalo.entrecode.de/',
  develop: 'http://localhost:7471/',
};

/**
 * API connector for public APIs. This is the successor of ec.datamanager.js.
 *
 * When instantiating this as an ecUser please set the ecUser flag to true. This will use the
 * tokenStore for ecUsers and not the ones for each Data Manager. If you don't do this you must set
 * the token with `publicAPI.setToken(session.getToken());`.
 */
export default class PublicAPI extends Core {
  shortID: string;
  dataManagerID: string;
  title: string;
  description: string;
  locales: Array<string>;
  defaultLocale: string;
  models: Array<any>;
  account: any;
  config: any;

  /**
   * Creates a new instance of {@link PublicAPI} API connector.
   *
   * @param {string} id shortID of the desired DataManager.
   * @param {environment?} environment the environment to connect to.
   * @param {boolean?} ecUser if you are an ecUser it is best to set this to true
   */
  constructor(id: string, environment: environment = 'live', ecUser: boolean = false) {
    if (!id || !/[a-f0-9]{8}/i.test(id)) {
      throw new Error('must provide valid shortID');
    }

    if (!(environment in urls)) {
      throw new Error('invalid environment specified');
    }

    super({ [environment]: `${urls[environment]}api/${id}` }, environment, !ecUser ? id : '');
    this[shortIDSymbol] = id;
    this[assetBaseURLSymbol] = urls[environment];

    Object.defineProperty(this, 'shortID', {
      enumerable: false,
      get: () => this[shortIDSymbol],
    });

    ['dataManagerID', 'title', 'description', 'locales',
      'defaultLocale', 'models', 'account', 'config']
    .forEach((property) => {
      Object.defineProperty(this, property, {
        enumerable: true,
        get: () => this[resourceSymbol][property],
      });
    });
  }

  /**
   * Resolves the root response of ths PublicAPI DataManager
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<PublicAPI>} returns this
   */
  resolve(reload: boolean = false): Promise<PublicAPI> {
    if (!reload && this[resourceSymbol]) {
      return Promise.resolve(this);
    }

    return get(this[environmentSymbol], this.newRequest())
    .then(([res, traversal]) => {
      this[resourceSymbol] = halfred.parse(res);
      this[traversalSymbol] = traversal;

      return this;
    });
  }

  /**
   * Load the list of models. Will resolve to a object with modelTitle as key and {@link Model} as
   * value.
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<any>} Object with models
   */
  modelList(reload: boolean = false): Promise<any> {
    return this.resolve(reload)
    .then(() => {
      const out = {};
      this.models.forEach((model) => {
        out[model.title] = model;
      });
      this[modelCacheSymbol] = out; // TODO is this needed?
      return out;
    });
  }

  /**
   * Set the clientID to use with the public API. Currently only `rest` is supported.
   *
   * @param {string} clientID the clientID.
   * @returns {PublicAPI} this object for chainability
   */
  setClientID(clientID: string): PublicAPI {
    if (!clientID) {
      throw new Error('ClientID must be defined');
    }

    if (clientID !== 'rest') {
      throw new Error('ec.sdk currently only supports client \'rest\'');
    }

    this[tokenStoreSymbol].setClientID(clientID);
    return this;
  }

  /**
   * Login with email and password. Currently only supports `rest` clientID with body post of
   * credentials and tokenMethod `body`.
   *
   * @param {string} email email address of the user
   * @param {string} password password of the user
   * @returns {Promise<string>} Promise resolving to the issued token
   */
  login(email: string, password: string): Promise<string> {
    return Promise.resolve()
    .then(() => {
      if (this[tokenStoreSymbol].hasToken()) {
        throw new Error('already logged in or old token present. logout first');
      }

      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }

      return this.follow(`${this[shortIDSymbol]}:_auth/login`);
    })
    .then((request) => {
      request.withTemplateParameters({ clientID: this[tokenStoreSymbol].getClientID() });
      return post(this[environmentSymbol], request, { email, password });
    })
    .then(([token]) => {
      this[tokenStoreSymbol].setToken(token.token);
      this[eventsSymbol].emit('login', token.token);

      return token.token;
    });
  }

  /**
   * Logout with existing token. Will invalidate the token with the public API and remove any
   * cookie stored.
   *
   * @returns {Promise<void>} Promise resolving undefined on success.
   */
  logout(): Promise<void> {
    return Promise.resolve()
    .then(() => {
      if (!this[tokenStoreSymbol].hasToken()) {
        return Promise.resolve();
      }

      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }

      return this.follow(`${this[shortIDSymbol]}:_auth/logout`)
      .then((request) => {
        request.withTemplateParameters({
          clientID: this[tokenStoreSymbol].getClientID(),
          token: this[tokenStoreSymbol].getToken(),
        });
        return post(this[environmentSymbol], request);
      });
    })
    .then(() => {
      this[eventsSymbol].emit('logout');
      this[tokenStoreSymbol].deleteToken();
      return Promise.resolve();
    });
  }

  /**
   * Will check if the given email is available for login.
   *
   * @example
   * return api.emailAvailable(email)
   * .then((available) => {
   *    if (available){
   *      return api.signup(email, password);
   *    } else {
   *      return showError(new Error(`Email ${email} already registered.`));
   *    }
   * });
   *
   * @param {string} email the email to check.
   * @returns {Promise<boolean>} Whether or not the email is available.
   */
  emailAvailable(email: string): Promise<boolean> {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }

      return this.follow(`${this[shortIDSymbol]}:_auth/email-available`);
    })
    .then((request) => {
      request.withTemplateParameters({ email });
      return get(this[environmentSymbol], request);
    })
    .then(([a]) => a.available);
  }

  /**
   * Signup a new account. Invite may be required.
   *
   * @example
   * return api.signup(email, password, invite)
   * .then((token) => {
   *   api.setToken(token);
   *   return show('Successfully registered account');
   * });
   *
   * @param {string} email email for the new account
   * @param {string} password password for the new account
   * @param {string?} invite optional invite. signup can be declined without invite.
   * @returns {Promise<string>} Promise resolving with the token
   */
  signup(email: string, password: string, invite?: string): Promise<string> {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }
      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }

      return this.follow(`${this[shortIDSymbol]}:_auth/signup`);
    })
    .then((request) => {
      request.withTemplateParameters({
        clientID: this[tokenStoreSymbol].getClientID(),
        invite,
      });
      return getUrl(this[environmentSymbol], request);
    })
    .then(url => superagentFormPost(url, { email, password }))
    .then((token) => {
      this[tokenStoreSymbol].setToken(token.token);
      return Promise.resolve(token.token);
    });
  }

  /**
   * Start a password reset.
   *
   * @example
   * return api.resetPassword(email)
   * .then(() => show(`Password reset link send to ${email}`))
   *
   * @param {string} email email of the account
   * @returns {Promise<void>} Promise resolving on success.
   */
  resetPassword(email: string): Promise<void> {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }

      return this.follow(`${this[shortIDSymbol]}:_auth/password-reset`);
    }).then((request) => {
      request.withTemplateParameters({
        clientID: this[tokenStoreSymbol].getClientID(),
        email,
      });
      return getEmpty(this[environmentSymbol], request);
    });
  }

  /**
   * Creates a new anonymous account.
   *
   * @example
   * return api.createAnonymous()
   * .then((token) => {
   *   return save(token)
   * });
   *
   * @param {Date} validUntil valid until date
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token response.
   */
  createAnonymous(validUntil: Date): Promise<jwtResponse> {
    return this.follow(`${this[shortIDSymbol]}:_auth/anonymous`)
    .then((request) => {
      if (validUntil) {
        request.withTemplateParameters({ validUntil: validUntil.toISOString() });
      }
      return post(this[environmentSymbol], request, {});
    })
    .then(([tokenResponse]) => tokenResponse);
  }

  /**
   * Loads the account object of a public user.
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<any>} Object account info
   */
  me(reload: boolean = false): Promise<any> { //TODO advanced type
    return this.resolve(reload)
    .then(() => {
      return this[resourceSymbol].account;
    });
  }

  /**
   * Loads the JSON Schema for a given model. Loaded Schemas will be stored in tv4 cache upon first
   * load.
   *
   * @param {string} model the model for which to load the JSON Schema
   * @param {string} method the method for which the JSON Schema should be loaded
   * @returns {Promise<object>} the loaded JSON Schema
   */
  getSchema(model: string, method: string = 'get') {
    return Promise.resolve()
    .then(() => {
      if (!model) {
        throw new Error('model must be defined');
      }

      if (['get', 'put', 'post'].indexOf(method) == -1) {
        throw new Error('invalid method, only: get, post, and put');
      }

      if (!this[resourceSymbol]) {
        return this.resolve();
      }
      return undefined;
    })
    .then(() => {
      let link = this.getLink(`${this[shortIDSymbol]}:${model}`).profile;
      if (method !== 'get') {
        link = link.split('?');
        if (link.length === 1) {
          link.push('');
        }
        link[1] = qs.parse(link[1]);
        link[1].template = method;
        link[1] = qs.stringify(link[1]);
        link = link.join('?');
      }

      return getSchema(link);
    });
  }

  /**
   * This is a short hand for {@link Core#link} for auth links in public APIs. It will load
   * `${shortID}:_auth/${name}` link.
   *
   * @param {string} name Name of the auth link to get.
   * @param {object?} templateParameter Optional template parameters
   * @returns {Promise<string>}
   */
  getAuthLink(name: string, templateParameter: any = {}): Promise<string> { // todo clientID?
    return this.follow(`${this.shortID}:_auth/${name}`)
    .then(request => {
      request.withTemplateParameters(templateParameter);
      return getUrl(this[environmentSymbol], request);
    });
  }

  /**
   * Load the {@link EntryList}.
   *
   * @example
   * return api.entryList('myModel')
   * .then(list => {
   *   return list.getAllItems().find(entry => entry.id === '1234567');
   * })
   * .then(entry => {
   *   return show(entry);
   * });
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {filterOptions?} options filter options
   * @returns {Promise<EntryList>} Promise resolving to EntryList
   */
  entryList(model: string, options?: filterOptions | any): Promise<EntryList> { // remove any
    return Promise.resolve()
    .then(() => {
      if (!model) {
        throw new Error('model must be defined');
      }

      if (
        options && Object.keys(options).length === 1
        && ((options.id && (typeof options.id === 'string' || (!('any' in options.id) && !('all' in options.id))))
          ||
          (options._id && (typeof options._id === 'string' || (!('any' in options._id) && !('all' in options._id)))))
      ) {
        throw new Error('Providing only an id/_id in entryList filter will result in single resource response. Please use PublicAPI#entry');
      }

      return this.follow(`${this[shortIDSymbol]}:${model}`);
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink(`${this[shortIDSymbol]}:${model}`).href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => createList(res, this[environmentSymbol], traversal, `${this[shortIDSymbol]}:${model}`));
  }

  /**
   * Load a single {@link EntryResource}.
   *
   * @example
   * return dm.entry('myModel', '1234567')
   * .then(entry => {
   *   return show(entry);
   * });
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {string} id the entry id
   * @param {number|object?} options options for this entry. can be _levels, _fields or number for
   *   levels directly request
   * @returns {Promise<EntryResource>} Promise resolving to EntryResource
   */
  entry(model: string, id: string, options: number | any = {}): Promise<EntryResource> {
    return Promise.resolve()
    .then(() => {
      if (!model) {
        throw new Error('model must be defined');
      }

      if (!id) {
        throw new Error('id must be defined');
      }

      if (Number.isInteger(options)) {
        options = { _levels: options };
      }

      if ('_levels' in options && !Number.isInteger(options._levels)) {
        throw new Error('_levels must be integer');
      }

      if ('_fields' in options && !Array.isArray(options._fields)) {
        throw new Error('_fields must be Array<string>');
      }

      if ('_fields' in options) {
        options._fields = options._fields.join(',');
      }

      return this.follow(`${this[shortIDSymbol]}:${model}`);
    })
    .then((request) => {
      options._id = id;
      request.withTemplateParameters(options);
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => createEntry(res, this[environmentSymbol], traversal));
  }

  /**
   * Create a new entry.
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {object} entry object representing the entry.
   * @param {number} levels levels parameter to have them returned
   * @returns {Promise<EntryResource>} the newly created EntryResource
   */
  createEntry(model: string, entry: any, levels?: number): Promise<EntryResource> {
    return Promise.resolve()
    .then(() => {
      if (!model) {
        throw new Error('model must be defined');
      }

      if (!entry) {
        throw new Error('Cannot create resource with undefined object.');
      }

      if (levels < 1 || levels >= 5) {
        throw new Error('levels must be between 1 and 5');
      }

      return this.link(`${this[shortIDSymbol]}:${model}`);
    })
    .then(link => validator.validate(entry, `${link.profile}?template=post`))
    .then(() => this.follow(`${this[shortIDSymbol]}:${model}`))
    .then(request => {
      if (levels) {
        request.withTemplateParameters({ _levels: levels });
      }
      return post(this[environmentSymbol], request, entry)
    })
    .then(([res, traversal]) => createEntry(res, this[environmentSymbol], traversal));
  }

  /**
   * Checks a permission for the currently logged in public user
   *
   * @param {string} permission the permission to check.
   * @param {boolean} refresh whether or not it should use a cached response
   * @returns {Promise<boolean>} true if user has permission, false otherwise.
   */
  checkPermission(permission: string, refresh: boolean = false): Promise<boolean> {
    return Promise.resolve()
    .then(() => {
      if (!permission) {
        throw new Error('permission must be defined');
      }

      if (!refresh && this[permissionsSymbol] && new Date().getTime() - this[permissionsLoadedTimeSymbol] <= 300000) { // 5 Minutes
        return undefined;
      }

      return this.follow('_permissions')
      .then(request => get(this[environmentSymbol], request))
      .then(([response]) => {
        this[permissionsSymbol] = ShiroTrie.newTrie();
        this[permissionsSymbol].add(response.permissions);
        this[permissionsLoadedTimeSymbol] = new Date();
        return undefined;
      });
    })
    .then(() => this[permissionsSymbol].check(permission));
  }

  /**
   * Load the {@link PublicAssetList}.
   *
   * @example
   * return api.assetList()
   * .then(assets => {
   *   return assets.getAllItems().find(asset => asset.assetID === 'thisOne');
   * })
   * .then(asset => {
   *   return show(asset);
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<PublicAssetList>} Promise resolving to PublicAssetList
   */
  assetList(options?: filterOptions | any): Promise<PublicAssetList> {
    return Promise.resolve()
    .then(() => {
      if (
        options
        && Object.keys(options).length === 1 && 'assetID' in options
        && (typeof options.assetID === 'string' || (!('any' in options.assetID) && !('all' in options.assetID)))
      ) {
        throw new Error('Cannot filter assetList only by assetID. Use PublicAPI#asset() instead');
      }

      return this.follow('ec:api/assets');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:api/assets').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PublicAssetList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link PublicAssetResource}.
   *
   * @example
   * return api.asset('thisOne')
   * .then(asset => {
   *   return show(asset);
   * });
   *
   * @param {string} assetID the assetID
   * @returns {Promise<PublicAssetResource>} Promise resolving to PublicAssetResource
   */
  asset(assetID: string): Promise<PublicAssetResource> {
    return Promise.resolve()
    .then(() => {
      if (!assetID) {
        throw new Error('assetID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:api/assets')
      .withTemplateParameters({ assetID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PublicAssetResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Create a new asset.
   *
   * @param {object|string} input representing the asset, either a path, a FormData object,
   *  a readStream, or an object containing a buffer.
   * @param {object} options options for creating an asset.
   * @returns {Promise<function<Promise<PublicAssetResource>>>} the newly created
   *   PublicAssetResource
   */
  createAsset(input: string | any, options: assetOptions = {}): Promise<() => Promise<PublicAssetResource>> {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return this.follow('ec:api/assets')
    .then((request) => getUrl(this[environmentSymbol], request))
    .then((url) => {
      const superagentRequest = superagent.post(url);

      const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line
                                                                                      // no-undef
      if (isFormData) {
        superagentRequest.send(input);
      } else if (typeof input === 'string') {
        superagentRequest.attach('file', input);
      } else if (Buffer.isBuffer(input)) {
        if (!('fileName' in options)) {
          throw new Error('When using buffer file input you must provide options.fileName.');
        }
        superagentRequest.attach('file', input, <string>options.fileName);
      } else {
        throw new Error('Cannot handle input.');
      }

      if (options.title) {
        if (isFormData) {
          input.set('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.set('tags', options.tags);
        } else {
          options.tags.forEach((tag) => {
            superagentRequest.field('tags', tag);
          });
        }
      }

      return superagentPost(this[environmentSymbol], superagentRequest);
    })
    .then((response) => {
      const url = response._links['ec:asset'].href;
      const queryStrings = qs.parse(url.substr(url.indexOf('?') + 1));
      return () => this.asset(queryStrings.assetID);
    });
  }

  /**
   * Create multiple new asset.
   *
   * @param {object|array<object|string>} input representing the asset, either an array of paths, a
   *   FormData object, a array of readStreams, or an array containing buffers.
   * @param {object} options options for creating an asset.
   * @returns {Promise<function<Promise<AssetList>>>} the newly created assets as AssetList
   */
  createAssets(input: string | any, options: assetOptions = {}): Promise<() => Promise<PublicAssetList>> {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return this.follow('ec:api/assets')
    .then((request) => getUrl(this[environmentSymbol], request))
    .then((url) => {
      const superagentRequest = superagent.post(url);

      const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line
                                                                                      // no-undef
      if (isFormData) {
        superagentRequest.send(input);
      } else {
        input.forEach((file, index) => {
          if (typeof file === 'string') {
            superagentRequest.attach('file', file);
          } else if (Buffer.isBuffer(file)) {
            if (!('fileName' in options)
              || !Array.isArray(options.fileName)
              || !options.fileName[index]) {
              throw new Error('When using buffer file input you must provide options.fileName.');
            }
            superagentRequest.attach('file', file, options.fileName[index]);
          } else {
            throw new Error('Cannot handle input.');
          }
        });
      }
      if (options.title) {
        if (isFormData) {
          input.set('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.set('tags', options.tags);
        } else {
          options.tags.forEach((tag) => {
            superagentRequest.field('tags', tag);
          });
        }
      }

      return superagentPost(this[environmentSymbol], superagentRequest);
    })
    .then((response) => {
      const urls = response._links['ec:asset'].map((link) => {
        const queryStrings = qs.parse(link.href.substr(link.href.indexOf('?') + 1));
        return queryStrings.assetID;
      });

      return () => this.assetList({ assetID: { any: urls } });
    });
  }

  /**
   * Best file helper for files.
   *
   * @param {string} assetID - the assetID
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getFileUrl(assetID: string, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${this[assetBaseURLSymbol]}files/${assetID}/url`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }

  /**
   * Best file helper for images.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getImageUrl(assetID: string, size: number, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${this[assetBaseURLSymbol]}files/${assetID}/url${size ? `?size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getImageThumbUrl(assetID: string, size: number, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${this[assetBaseURLSymbol]}files/${assetID}/url?thumb${size ? `&size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }
}

export type jwtResponse = {
  jwt: string;
  accountID: string;
  iat: number;
  exp: number
}

export type assetOptions = {
  fileName?: string | Array<string>,
  title?: string,
  tags?: Array<string>
}
