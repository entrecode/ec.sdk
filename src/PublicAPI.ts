import * as halfred from 'halfred';
import * as qs from 'querystring';
import * as ShiroTrie from 'shiro-trie';
import * as superagent from 'superagent';
import * as validator from 'json-schema-remote';
import * as validate from 'validator';
import * as shortID from 'shortid';

import Core, { environment, options } from './Core';
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
  postEmpty,
  superagentPost,
  locale,
  put,
  shortenUUID,
  del,
} from './helper';
import DMAssetResource from './resources/publicAPI/DMAssetResource';
import DMAssetList from './resources/publicAPI/DMAssetList';
import Problem from './Problem';
import HistoryEvents from './resources/publicAPI/HistoryEvents';
import PublicTagList from './resources/publicAPI/PublicTagList';
import PublicTagResource from './resources/publicAPI/PublicTagResource';
import DMAuthTokenResource from './resources/publicAPI/DMAuthTokenResource';
import DMAuthTokenList from './resources/publicAPI/DMAuthTokenList';

const { convertValidationError, newError } = require('ec.errors')();

const resourceSymbol: any = Symbol.for('resource');
const tokenStoreSymbol: any = Symbol.for('tokenStore');
const traversalSymbol: any = Symbol.for('traversal');
const eventsSymbol: any = Symbol.for('events');
const environmentSymbol: any = Symbol.for('environment');
const relationsSymbol: any = Symbol.for('relations');

const shortIDSymbol: any = Symbol('_shortID');
const modelCacheSymbol: any = Symbol('_modelCache');
const permissionsSymbol: any = Symbol('_permissionsSymbol');
const permissionsLoadedTimeSymbol: any = Symbol('_permissionsLoadedTimeSymbol');
const assetBaseURLSymbol: any = Symbol('assetBaseURL');
const requestCacheSymbol: any = Symbol('requestCache');
const fieldConfigCacheSymbol: any = Symbol('fieldConfigCache');
const refreshRequestSymbol: any = Symbol('refreshRequest');

validator.setLoggingFunction(() => {});

const urls = {
  live: 'https://datamanager.entrecode.de/api',
  stage: 'https://datamanager.cachena.entrecode.de/api',
  nightly: 'https://datamanager.buffalo.entrecode.de/api',
  develop: 'http://localhost:7471/api',
};

function chunk(array, size) {
  const chunked_arr: Array<any> = [];
  const copied = [...array]; // ES6 destructuring
  const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
  for (let i = 0; i < numOfChild; i++) {
    chunked_arr.push(copied.splice(0, size));
  }
  return chunked_arr;
}
/**
 * API connector for public APIs. This is the successor of
 * [ec.datamanager.js](https://github.com/entrecode/ec.datamanager.js).
 *
 * When instantiating this as an ecUser please set the ecUser flag to true. This will use the
 * tokenStore for ecUsers and not the ones for each Data Manager. If you don't do this you must set
 * the token with `publicAPI.setToken(session.getToken());`.
 *
 * @class
 *
 * @example
 * // node usage:
 * const { PublicAPI } = require('ec.sdk');
 * const api = new PublicAPI('beefbeef', { environment: 'live', noCookie: true }, true); // for ec user
 * // or
 * const api = new PublicAPI('9062c09a-c2a2-40dd-b1cf-332f497f9bde'); // with UUID as well
 * api.setToken(config.accessToken);
 *
 * // frontend usage with session:
 * const session new Session();
 * let api = new PublicAPI('beefbeef', 'live', true);
 * // same as
 * api = new PublicAPI('https://datamanager.entrecode.de/api/beefbeef', 'willBeIgnored', true);
 * session.setClientID('rest');
 * return session.login('me@entrecode.de', 'letmein')
 * .then(() =>
 *   api.entryList('muffins', { awesome: true })
 *   .then(list => list.map((entry) => {
 *     if(isNoLongerAwesome(entry)){
 *       entry.awesome = false;
 *     }
 *
 *     if(!entry.isDirty){
 *       return entry;
 *     }
 *
 *     return entry.save();
 *   }));
 *
 * @prop {object} account The current logged in account if it is a public user
 * @prop {object} config The public config of the connected Data Manager
 * @prop {string} dataManagerID unshortened dataManagerID
 * @prop {string} defaultLocale default locale
 * @prop {string} description description of the connected Data Manager
 * @prop {Array<string>} locales all available locales
 * @prop {Array<any>} models array of all models in the connected Data Manager
 * @prop {string} shortID shortened dataManagerID
 * @prop {string} title title of the connected Data Manager
 *
 * @param {string} idOrURL shortID or dataManagerID of the desired DataManager or url in old sdk like syntax.
 * @param {environment|envOptions?} environment the environment to connect to, ignored when url is passed to
 *   idOrUrl.
 * @param {boolean?} ecUser if you are an ecUser it is best to set this to true
 */
export default class PublicAPI extends Core {
  // constructor(idOrURL: string, environment: environment = 'live', ecUser: boolean = false) {
  constructor(idOrURL: string, envOrOptions: options | environment = 'live', ecUser: boolean = false) {
    if (!idOrURL) {
      throw new Error('idOrURL must be defined');
    }

    let env;

    if (envOrOptions === null) {
      envOrOptions = 'live';
    }

    if (typeof envOrOptions === 'string') {
      env = {
        environment: envOrOptions,
      };
    } else {
      env = envOrOptions;
    }

    if (!env.environment) {
      env.environment = 'live';
    }

    if (env.ecUser) {
      ecUser = env.ecUser;
    }

    let id;

    if (/^[a-f0-9]{8}$/i.test(idOrURL)) {
      id = idOrURL;
    } else if (/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(idOrURL)) {
      id = shortenUUID(idOrURL, 2);
    } else {
      const result =
        /^https?:\/\/(datamanager\.(?:(?:cachena|buffalo)\.)?entrecode\.de|localhost:7471)\/api\/([a-f0-9]{8})\/?$/.exec(
          idOrURL,
        );
      if (!result) {
        throw new Error('could not parse idOrURL');
      }

      switch (result[1]) {
        case 'datamanager.entrecode.de':
          env.environment = 'live';
          break;
        case 'datamanager.cachena.entrecode.de':
          env.environment = 'stage';
          break;
        case 'datamanager.buffalo.entrecode.de':
          env.environment = 'nightly';
          break;
        case 'localhost:7471':
        default:
          env.environment = 'develop';
          break;
      }

      id = result[2];
    }

    if (!ecUser) {
      if (env.cookieModifier) {
        env.cookieModifier += id;
      } else {
        env.cookieModifier = id;
      }
    }

    if (!(env.environment in urls)) {
      const foundOne = Object.keys(urls).find((urlKey) => env.environment.indexOf(urlKey) !== -1);
      if (foundOne) {
        env.environment = foundOne;
        env.cookieModifier += shortID.generate();
      } else {
        throw new Error('invalid environment specified');
      }
    }

    if (!(env.environment in urls)) {
      throw new Error('invalid environment specified');
    }

    super({ [env.environment]: `${urls[env.environment]}/${id}` }, env);
    this[shortIDSymbol] = id;
    this[assetBaseURLSymbol] = urls[env];
    this[requestCacheSymbol] = undefined;
    this[fieldConfigCacheSymbol] = new Map();
  }

  get account() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <any>this[resourceSymbol].account;
  }

  get config() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <any>this[resourceSymbol].config;
  }

  get dataManagerID() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <string>this[resourceSymbol].dataManagerID;
  }

  get defaultLocale() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <string>this[resourceSymbol].defaultLocale;
  }

  get description() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <string>this[resourceSymbol].description;
  }

  get locales() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <Array<string>>this[resourceSymbol].locales;
  }

  get models() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <Array<any>>this[resourceSymbol].models;
  }

  get shortID() {
    return <string>this[shortIDSymbol];
  }

  get title() {
    if (!this[resourceSymbol]) {
      throw new Error('SDK not initialized, please call `await PublicAPI#resolve()`.');
    }
    return <string>this[resourceSymbol].title;
  }

  /**
   * Load a single {@link PublicAssetResource}.
   *
   * @example
   * return api.asset(thisOne)
   * .then(asset => show(asset));
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
        const request = this.newRequest().follow('ec:api/assets').withTemplateParameters({ assetID });
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new PublicAssetResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load the list of assetGroupIDs.
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<Array<string>>} Resolves to an array with all available asssetGroupIDs
   */
  assetGroupList(reload: boolean = false): Promise<any> {
    return this.resolve(reload).then(() =>
      Object.keys(this[resourceSymbol].allLinks())
        .map((key) => {
          const result = /^ec:dm-assets\/(.*)$/.exec(key);
          if (!result) {
            return undefined;
          }

          return result[1];
        })
        .filter((x) => !!x),
    );
  }

  /**
   * Load the {@link PublicAssetList}.
   *
   * @example
   * return api.assetList({ filter: { type: 'image'} })
   * .then(assets => assets.getAllItems().find(asset => asset.title.toLowerCase() === 'favicon' ))
   * .then(asset => show(asset));
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<PublicAssetList>} Promise resolving to PublicAssetList
   */
  assetList(options?: filterOptions | any): Promise<PublicAssetList> {
    return Promise.resolve()
      .then(() => {
        if (
          options &&
          Object.keys(options).length === 1 &&
          'assetID' in options &&
          (typeof options.assetID === 'string' || (!('any' in options.assetID) && !('all' in options.assetID)))
        ) {
          throw new Error('Cannot filter assetList only by assetID. Use PublicAPI#asset() instead');
        }

        return this.follow('ec:api/assets');
      })
      .then((request) => {
        request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:api/assets').href));
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new PublicAssetList(res, this[environmentSymbol], traversal));
  }

  /**
   * Change the logged in account to the given new email address.
   *
   * @example
   * return api.changeEmail(newEmail)
   * .then(() => show(`Email change started. Please verify with your new address.`))
   *
   * @param {string} email the new email
   * @returns {Promise<undefined>} Promise resolving on success.
   */
  changeEmail(email: string): Promise<void> {
    return Promise.resolve().then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }
      return this.follow(`${this[shortIDSymbol]}:_auth/change-email`).then((request) => {
        return this.dispatch(() => postEmpty(this[environmentSymbol], request, { email }));
      });
    });
  }

  /**
   * Checks a permission for the currently logged in public user. ec.users check their permission
   * with {@link Session#checkPermission}.
   *
   * @param {string} permission the permission to check
   * @param {boolean} refresh whether or not it should use a cached response
   * @returns {Promise<boolean>} true if user has permission, false otherwise
   */
  checkPermission(permission: string, refresh: boolean = false): Promise<boolean> {
    return Promise.resolve()
      .then(() => {
        if (!permission) {
          throw new Error('permission must be defined');
        }

        if (!refresh && this[permissionsSymbol] && new Date().getTime() - this[permissionsLoadedTimeSymbol] <= 300000) {
          // 5 Minutes
          return undefined;
        }

        if (!this[requestCacheSymbol]) {
          this[requestCacheSymbol] = this.follow('_permissions')
            .then((request) => this.dispatch(() => get(this[environmentSymbol], request)))
            .then(([response]) => {
              this[requestCacheSymbol] = undefined;
              this[permissionsSymbol] = ShiroTrie.newTrie();
              this[permissionsSymbol].add(response.permissions);
              this[permissionsLoadedTimeSymbol] = new Date();
              return undefined;
            });
        }

        return this[requestCacheSymbol];
      })
      .then(() => <boolean>this[permissionsSymbol].check(permission));
  }

  /**
   * Programatically signup a user, mostly used for special register flows using legacy users or magic link login.
   *
   * @example
   *
   * const createdAccount = await api.configurableSignup({
   *   email: 'test@entrecode.de',
   *   password: 'CorrectHorseBatteryStaple', // optional
   *   invite: null, // optional
   *   pending: true, // optional
   *   sendWelcomeMail: false, // optional
   *   anonymousToken: 'eyasldfaslfkelaewjflejf...', // optional
   * });
   *
   * const { accountID, email, hasPassword, pending } = createdAccount;
   *
   * @param {{email: string, password?: string, invite?: string, pending?: boolean, sendWelcomeMail?: boolean, anonymousToken?: string }} body Request body containing configuration options.
   * @returns {Promise<{accountID: string, email: string, hasPassword: boolean, pending: boolean}>} Promise resolving to the created account
   */
  async configurableSignup(body: {
    email: string;
    password?: string;
    invite?: string;
    pending?: boolean;
    sendWelcomeMail?: boolean;
    anonymousToken?: string;
  }): Promise<{
    accountID: string;
    email: string;
    hasPassword: boolean;
    pending: boolean;
  }> {
    if (!body || typeof body !== 'object') {
      throw new Error('body must be defined');
    }
    if (!('email' in body)) {
      throw new Error('email must be defined in body');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:_auth/api/signup`);
    const [response] = await this.dispatch(() => post(this[environmentSymbol], request, body));
    return response;
  }

  /**
   * Programatically complete a signup with a single use validationToken, mostly used for special register flows using legacy users or magic link login.
   *
   * @param {{validationToken: string, useragent?: string ip?: string, password?: string, pending?: boolean}} body Request body containing configuration options.
   * @returns {Promise<{access_token: string, refresh_token: string}>} Promise resolving to the issued token
   */
  async configurableSignupEdit(body: {
    validationToken: string;
    useragent?: string;
    ip?: string;
    password?: string;
    pending?: boolean;
    clientID?: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    if (!body || typeof body !== 'object') {
      throw new Error('body must be defined');
    }
    if (!('validationToken' in body)) {
      throw new Error('validationToken must be defined in body');
    }

    const b: any = {};
    if (this[tokenStoreSymbol].hasClientID()) {
      Object.assign(b, { clientID: this[tokenStoreSymbol].getClientID() });
    }
    Object.assign(b, body);

    if (!b.clientID) {
      throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string) or sent in body');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:_auth/api/signup`);
    const [response] = await this.dispatch(() => put(this[environmentSymbol], request, b));

    return response;
  }

  /**
   * Creates a new anonymous account.
   *
   * @example
   * return api.createAnonymous()
   * .then(token => yourFancySaveFkt(token));
   *
   * @param {Date?} validUntil valid until date
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token
   */
  createAnonymous(validUntil?: Date): Promise<jwtResponse> {
    return this.follow(`${this[shortIDSymbol]}:_auth/anonymous`)
      .then((request) => {
        if (validUntil) {
          request.withTemplateParameters({ validUntil: validUntil.toISOString() });
        }
        return this.dispatch(() => post(this[environmentSymbol], request, {}));
      })
      .then(([tokenResponse]) => tokenResponse);
  }

  /**
   * Create a new asset. This should handle various input types.
   *
   * The most basic type is a string representing a file path, this can be used on node projects.
   *
   * For frontend usage you musst provide a
   * {@link https://developer.mozilla.org/de/docs/Web/API/FormData|FormData} object containing the
   * file in a field with the name 'file'.
   *
   * @param {object|string} input representing the asset, either a path, or a FormData object.
   * @param {object} options options for creating an asset.
   * @returns {Promise<function<Promise<PublicAssetResource>>>} Promise resolving to a Promise
   *   factory which then resolves to the newly created PublicAssetResource
   */
  createAsset(input: string | any, options: assetOptions = {}): Promise<() => Promise<PublicAssetResource>> {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return this.follow('ec:api/assets')
      .then((request) => this.dispatch(() => getUrl(this[environmentSymbol], request)))
      .then((url) => {
        const superagentRequest = superagent.post(url);

        const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line
        // no-undef
        if (isFormData) {
          superagentRequest.send(input);
        } else if (typeof input === 'string') {
          superagentRequest.attach('file', input);
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

        // THIS dispatch for superagent? test if request is submittable n times?
        return superagentPost(this[environmentSymbol], superagentRequest);
      })
      .then((response) => {
        const url = response._links['ec:asset'].href;
        const queryStrings = qs.parse(url.substr(url.indexOf('?') + 1));
        return () => this.asset(<string>queryStrings.assetID);
      });
  }

  /**
   * Create a legacy asset.
   *
   * For frontend usage you musst provide a
   * {@link https://developer.mozilla.org/de/docs/Web/API/FormData|FormData} object containing the
   * multiple files in a field with the name 'file'.
   *
   * @param {object|array<object|string>} input representing the asset, either an array of paths, a
   *   FormData object, or an array of readStreams.
   * @param {object} options options for creating an asset.
   * @returns {Promise<function<Promise<AssetList>>>}  Promise resolving to a Promise
   *   factory which then resolves to the newly created assets as AssetList
   */
  createAssets(input: string | any, options: assetOptions = {}): Promise<() => Promise<PublicAssetList>> {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return this.follow('ec:api/assets')
      .then((request) => this.dispatch(() => getUrl(this[environmentSymbol], request)))
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

        // THIS dispatch for superagent? test if request is submittable n times?
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
   * Create one or multiple new assets. This should handle various input types.
   *
   * The most basic type is a string representing a file path, this can be used on node
   * projects.
   *
   * For frontend usage you must provide a
   * {@link https://developer.mozilla.org/de/docs/Web/API/FormData|FormData} object containing the
   * multiple files in a field with the name 'file'.
   *
   * In both cases you can add a string representing an url. DataManager will then create the assets from this url.
   *
   * @example
   * const createdAssets = await api.createDMAssets(
   *   'myAssetGroup',
   *   ['/path/to/file1', '/path/to/file2'],
   *   {
   *     fileName: ['filename1.png', 'filename2.png'], // omit for default filenames
   *     deduplicate: true, // you'll get back existing assets if duplicates exist
   *     defaultVariants: [ 256 ], // will generate a 256px-variant right away instead of on first request. Only use if needed!
   *   }
   * );
   *
   * @param {string} assetGroupID the asset group in which the asset should be created.
   * @param {object|array<object|string>|string} input representing the asset, either an array of
   *   paths, a FormData object, an array of readStreams, or a string.
   * @param {fileOptions} options options for creating the assets.
   * @returns {Promise<function<Promise<DMAssetList>>>}  Promise resolving to a Promise
   *   factory which then resolves to the newly created assets as DMAssetList
   */
  createDMAssets(assetGroupID: string, input: any, options: fileOptions = {}): Promise<DMAssetList | void> {
    return Promise.resolve()
      .then(() => {
        if (!assetGroupID) {
          throw new Error('assetGroupID must be defined');
        }

        if (!input) {
          throw new Error('Cannot create resource with undefined object.');
        }

        return this.follow(`ec:dm-assets/${assetGroupID}`);
      })
      .catch((error) => {
        if (error.message.indexOf('Link not present in root response.') !== -1) {
          throw new Error('assetGroup not found');
        }
        throw error;
      })
      .then((request) => this.dispatch(() => getUrl(this[environmentSymbol], request)))
      .then((url) => {
        const request = superagent.post(url);
        const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line no-undef
        if (isFormData) {
          request.send(input);
        } else {
          let assets;
          if (!Array.isArray(input)) {
            assets = [input];
            if ('fileName' in options && !Array.isArray(options.fileName)) {
              Object.assign(options, { fileName: [options.fileName] });
            }
          } else {
            assets = input;
          }
          assets.forEach((file, index) => {
            if (typeof file === 'string') {
              if (validate.isURL(file)) {
                request.field('url', file);
              } else {
                let fileFieldName = 'file';
                if (options.fileName) {
                  fileFieldName = options.fileName[index];
                }
                request.attach(fileFieldName, file);
              }
            } else {
              throw new Error('Cannot handle input.');
            }
          });

          if ('deduplicate' in options) {
            request.field('deduplicate', `${options.deduplicate}`);
          }

          if ('preserveFilenames' in options) {
            request.field('preserveFilenames', `${options.preserveFilenames}`);
          }

          if ('ignoreDuplicates' in options) {
            request.field('ignoreDuplicates', `${options.ignoreDuplicates}`);
          }

          if ('includeAssetIDInPath' in options) {
            request.field('includeAssetIDInPath', `${options.includeAssetIDInPath}`);
          }

          if ('defaultVariants' in options) {
            request.field('defaultVariants', JSON.stringify(options.defaultVariants));
          }
        }

        // TODO dispatch for superagent
        return superagentPost(this[environmentSymbol], request);
      })
      .then((response) => {
        if (!response || Object.keys(response).length === 0) {
          return undefined;
        }
        return new DMAssetList(response, this[environmentSymbol]);
      });
  }

  /**
   * Create a new entry.
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {object} entry object representing the entry.
   * @param {number} levels levels parameter to have them returned
   * @returns {Promise<EntryResource>} the newly created EntryResource
   */
  createEntry(model: string, entry: any, levels?: number): Promise<EntryResource | void> {
    let e;
    return Promise.resolve()
      .then(() => {
        if (!model) {
          throw new Error('model must be defined');
        }

        if (!entry) {
          throw new Error('Cannot create resource with undefined object.');
        }

        if (entry instanceof EntryResource) {
          e = entry.toOriginal();
        } else {
          e = entry;
        }

        if (levels !== undefined && (levels < 1 || levels > 5)) {
          throw new Error('levels must be between 1 and 5');
        }

        return this.link(`${this[shortIDSymbol]}:${model}`);
      })
      .then((link) =>
        validator.validate(e, `${link.profile}?template=post`).catch((e) => {
          throw new Problem(convertValidationError(e), locale);
        }),
      )
      .then(() => this.follow(`${this[shortIDSymbol]}:${model}`))
      .then((request) => {
        if (levels) {
          request.withTemplateParameters({ _levels: levels });
        }
        return this.dispatch(() => post(this[environmentSymbol], request, e));
      })
      .then(([res, traversal]): any => {
        if (!res || Object.keys(res).length === 0) {
          return undefined;
        }
        return createEntry(res, this[environmentSymbol], traversal);
      });
  }

  /**
   * Delete a single {@link PublicAssetResource}.
   *
   * @example
   * return api.deleteAsset(thisOne)
   * .then(()) => alert('Asset deleted'));
   *
   * @param {string} assetID the assetID
   * @returns {Promise<undefined>} Promise resolving when Asset got deleted
   */
  async deleteAsset(assetID: string): Promise<void> {
    if (!assetID) {
      throw new Error('assetID must be defined');
    }
    const request = this.newRequest().follow('ec:api/assets').withTemplateParameters({ assetID });
    await this.dispatch(() => del(this[environmentSymbol], request));
  }

  /**
   * Delete a single {@link EntryResource}.
   *
   * @example
   * return api.deleteEntry('myModel', '1234567')
   * .then(()) => alert('Entry deleted'));
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {string} id the entry id
   * @returns {Promise<undefined>} Promise resolving when Entry got deleted
   */
  async deleteEntry(model: string, id: string): Promise<void> {
    if (!model) {
      throw new Error('model must be defined');
    }

    if (!id) {
      throw new Error('id must be defined');
    }

    if (typeof id !== 'string') {
      throw new Error('invalid format for id');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:${model}`);
    request.withTemplateParameters(
      optionsToQuery({ id } as filterOptions, this.getLink(`${this[shortIDSymbol]}:${model}`).href, true),
    );
    await this.dispatch(() => del(this[environmentSymbol], request));
  }

  /**
   * Load a single {@link DMAssetResource}.
   *
   * @example
   * return api.dmAsset(thisOne)
   * .then(asset => show(asset));
   *
   * @param {string} assetGroupID the assetGroupID
   * @param {string} assetID the assetID
   * @returns {Promise<DMAssetResource>} Promise resolving to DMAssetResource
   */
  dmAsset(assetGroupID: string, assetID: string): Promise<DMAssetResource> {
    return Promise.resolve()
      .then(() => {
        if (!assetGroupID) {
          throw new Error('assetGroupID must be defined');
        }

        if (!assetID) {
          throw new Error('assetID must be defined');
        }

        return this.follow('ec:dm-asset/by-id');
      })
      .then((request) => {
        request.withTemplateParameters({ assetID, assetGroupID });
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new DMAssetResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Delete a single {@link DMAssetResource}.
   *
   * @example
   * return api.deleteDmAsset(thisOne)
   * .then(() => alert('Asset deleted'));
   *
   * @param {string} assetGroupID the assetGroupID
   * @param {string} assetID the assetID
   * @returns {Promise<undefined>} Promise resolving when entry is deleted
   */
  async deleteDmAsset(assetGroupID: string, assetID: string): Promise<void> {
    if (!assetGroupID) {
      throw new Error('assetGroupID must be defined');
    }

    if (!assetID) {
      throw new Error('assetID must be defined');
    }

    const request = await this.follow('ec:dm-asset/by-id');
    request.withTemplateParameters({ assetID, assetGroupID });
    await this.dispatch(() => del(this[environmentSymbol], request));
  }

  /**
   * Load the {@link DMAssetList}.
   *
   * @example
   * return api.dmAssetList('public', { filter: { type: 'image'} })
   * .then(assets => assets.getAllItems().find(asset => asset.title.toLowerCase() === 'favicon' ))
   * .then(asset => show(asset));
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMAssetList>} Promise resolving to DMAssetList
   */
  dmAssetList(assetGroupID: string, options?: filterOptions | any): Promise<DMAssetList> {
    return Promise.resolve()
      .then(() => {
        if (!assetGroupID) {
          throw new Error('assetGroupID must be defined');
        }

        if (
          options &&
          Object.keys(options).length === 1 &&
          'assetID' in options &&
          (typeof options.assetID === 'string' || (!('any' in options.assetID) && !('all' in options.assetID)))
        ) {
          throw new Error('Cannot filter assetList only by assetID. Use PublicAPI#dmAsset() instead');
        }

        return this.follow(`ec:dm-assets/${assetGroupID}`);
      })
      .catch((error) => {
        if (error.message.indexOf('Link not present in root response.') !== -1) {
          throw new Error('assetGroup not found');
        }

        throw error;
      })
      .then((request) => {
        request.withTemplateParameters(optionsToQuery(options, this.getLink(`ec:dm-assets/${assetGroupID}`).href));
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new DMAssetList(res, this[environmentSymbol], traversal));
  }

  /**
   * When the logged in user has a refresh token this function will do the token refresh. On successful
   * refreshal PublicAPI will emmit the event `refresh`, if it failes it will emmit `refreshError`. You
   * MUST handle these events.
   *
   * @returns {{access_token: string, refresh_token: string}} Returns the new token response on successful refresh
   */
  doRefreshToken(): Promise<{ access_token: string; refresh_token: string }> {
    if (!this[refreshRequestSymbol]) {
      this[refreshRequestSymbol] = Promise.resolve().then(async () => {
        if (!this[tokenStoreSymbol].getClientID()) {
          throw new Error('ClientID must be configured');
        }

        if (!this[tokenStoreSymbol].getRefreshToken()) {
          throw new Error('no refresh token configured');
        }

        try {
          const request = await this.follow(`${this[shortIDSymbol]}:_auth/token`);
          // no dispatch since we are the one refreshing…
          const [response] = await post(this[environmentSymbol], request, {
            grant_type: 'refresh_token',
            client_id: this[tokenStoreSymbol].getClientID(),
            refresh_token: this[tokenStoreSymbol].getRefreshToken(),
          });

          if (response.refresh_token) {
            this[tokenStoreSymbol].setRefreshToken(response.refresh_token);
          }
          this[tokenStoreSymbol].setToken(response.access_token);
          this[eventsSymbol].emit('refresh', response);
          this[refreshRequestSymbol] = undefined;
          return response;
        } catch (err) {
          this[eventsSymbol].emit('refreshError', err);
          this[refreshRequestSymbol] = undefined;
          throw err;
        }
      });
    }

    return this[refreshRequestSymbol];
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
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([a]) => <boolean>a.available);
  }

  /**
   * Load a single {@link EntryResource}.
   *
   * @example
   * return api.entry('myModel', '1234567')
   * .then(entry => {
   *   return show(entry);
   * });
   * // since 0.17.10
   * const entry = await api.entry('myModel', { urltitle: 'this-is-unique' });
   * await show(entry);
   *
   * @param {string} model name of the model for which the list should be loaded
   * @param {string | filterOptions} id the entry id
   * @param {number|object?} options options for this entry. can be _levels, _fields or number for
   *   levels directly request
   * @returns {Promise<EntryResource>} Promise resolving to EntryResource
   */
  entry(model: string, id: string | filterOptions, options: number | filterOptions = {}): Promise<EntryResource> {
    return Promise.resolve()
      .then(() => {
        if (!model) {
          throw new Error('model must be defined');
        }

        if (!id) {
          throw new Error('id must be defined');
        }

        if (Number.isInteger(options as number)) {
          options = { _levels: options } as filterOptions;
        }

        if (typeof id === 'object') {
          Object.assign(options, id);
          if ('_levels' in (options as filterOptions)) {
            throw new Error('Levels not allowed on single Entry request with filters');
          }
        } else if (typeof id === 'string') {
          (options as filterOptions)._id = id;
        } else {
          throw new Error('invalid format for id');
        }

        return this.follow(`${this[shortIDSymbol]}:${model}`);
      })
      .then((request) => {
        request.withTemplateParameters(
          optionsToQuery(options as filterOptions, this.getLink(`${this[shortIDSymbol]}:${model}`).href, true),
        );
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => {
        if ('count' in res && 'total' in res && !('_entryTitle' in res)) {
          // does look like a list
          if (res.total !== 1) {
            throw new Error(`Invalid number of results for single entry request: ${res.total}`);
          }

          return createList(res, this[environmentSymbol], traversal, `${this[shortIDSymbol]}:${model}`).then((list) =>
            list.getFirstItem(),
          );
        }

        return createEntry(res, this[environmentSymbol], traversal);
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
  entryList(model: string, options?: filterOptions | any): Promise<EntryList> {
    // remove any
    return Promise.resolve()
      .then(() => {
        if (!model) {
          throw new Error('model must be defined');
        }

        if (!options) {
          options = {};
        }

        options._list = true;

        if ('size' in options) {
          console.warn('ec.sdk: Size is deprecated – use _count instead.');
        }

        return this.follow(`${this[shortIDSymbol]}:${model}`);
      })
      .then((request) => {
        request.withTemplateParameters(
          optionsToQuery(options, this.getLink(`${this[shortIDSymbol]}:${model}`).href, true),
        );
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => {
        return createList(res, this[environmentSymbol], traversal, `${this[shortIDSymbol]}:${model}`);
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
  getAuthLink(name: string, templateParameter: any = {}): Promise<string> {
    // todo clientID?
    return this.follow(`${this.shortID}:_auth/${name}`).then((request) => {
      request.withTemplateParameters(templateParameter);
      return getUrl(this[environmentSymbol], request);
    });
  }

  /**
   * Load the HistoryEvents for this DataManager from v3 API.
   * Note: This Request only has pagination when you load a single modelID.
   *
   * @param {filterOptions | any} options The filter options
   * @returns {Promise<HistoryEvents} The filtered HistoryEvents
   */
  getEvents(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:api/history'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new HistoryEvents(res, this[environmentSymbol], traversal));
  }

  /**
   * Load fieldConfig for one or many models. Can be used to configure and style forms etc.
   *
   * @param {string|Array<string>} modelTitle The model title or array of model titles to load the field config for.
   * @returns {Promise<object>} Returns either a Object with single model field config, or an object with multiple field configs
   */
  getFieldConfig(modelTitle: string | Array<string>): Promise<models | fields> {
    return Promise.resolve().then(() => {
      if (!modelTitle) {
        throw new Error('modelTitle must be defined');
      }

      const cacheKey = `${this[environmentSymbol]}/${Array.isArray(modelTitle) ? modelTitle.join('|') : modelTitle}`;

      if (this[fieldConfigCacheSymbol].has(cacheKey)) {
        const cachedResult = this[fieldConfigCacheSymbol].get(cacheKey);
        if (cachedResult instanceof Promise) {
          return cachedResult;
        }

        if (cachedResult.timestamp > new Date().getTime() - 1000 * 60 * 5) {
          return cachedResult.result;
        }
        this[fieldConfigCacheSymbol].delete(cacheKey);
      }

      const request = this.follow(`${this[shortIDSymbol]}:_fieldConfig`)
        .then((request) => {
          let titles: Array<string>;
          if (!Array.isArray(modelTitle)) {
            titles = [modelTitle];
          } else {
            titles = modelTitle;
          }
          request.withTemplateParameters({ modelTitle: titles.join(',') });
          return this.dispatch(() => get(this[environmentSymbol], request));
        })
        .then(([res]) => {
          let result;
          if (!Array.isArray(modelTitle)) {
            result = res[modelTitle];
          } else {
            result = res;
          }

          this[fieldConfigCacheSymbol].set(cacheKey, {
            result,
            timestamp: new Date(),
          });

          return result;
        })
        .catch((e) => {
          this[fieldConfigCacheSymbol].delete(cacheKey);
          throw e;
        });

      this[fieldConfigCacheSymbol].set(cacheKey, request);

      return request;
    });
  }

  /**
   * Best file helper for files.
   *
   * @param {string} assetID - the assetID
   * @returns {Promise<string>} URL to the file
   */
  getFileUrl(assetID: string): Promise<string> {
    return <Promise<string>>this.getFileVariant(assetID);
  }

  /**
   * Generic file helper for images and thumbnails.
   *
   * @param {string} assetID - assetID of the file requested. Can be legacy Asset (uuid v4) or
   *   AssetNeue.
   * @param {boolean} thumb - true when image should be a thumbnail
   * @param {number} size - the minimum size of the image
   * @param {imageType} type - the format of the image
   * @returns {Promise<string>} the url string of the requested image
   */
  getFileVariant(assetID: string, thumb: boolean = false, size?: number, type?: imageType) {
    return Promise.resolve()
      .then(() => {
        if (!assetID) {
          throw new Error('assetID must be defined');
        }

        let relation;
        const params: any = {};

        params.assetID = assetID;
        if (size) {
          params.size = size;
        }
        if (type) {
          params.type = type;
        }

        if (validate.isUUID(assetID, 4)) {
          relation = 'ec:api/assets/bestFile';
          params.thumb = thumb;
        } else if (thumb) {
          relation = 'ec:dm-asset/thumbnail';
        } else {
          relation = 'ec:dm-asset/file';
        }

        return this.follow(relation).then((request) => {
          request.withTemplateParameters(params);
          return this.dispatch(() => get(this[environmentSymbol], request));
        });
      })
      .then(([res]) => res.url);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {imageType} type - the format of the image
   * @returns {Promise<string>} URL to the file
   */
  getImageThumbUrl(assetID: string, size: number, type: imageType): Promise<string> {
    return <Promise<string>>this.getFileVariant(assetID, true, size, type);
  }

  /**
   * Best file helper for images.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {imageType} type - the format of the image
   * @returns {Promise<string>} URL to the file
   */
  getImageUrl(assetID: string, size: number, type: imageType): Promise<string> {
    return <Promise<string>>this.getFileVariant(assetID, false, size, type);
  }

  /**
   * Loads the JSON Schema for a given model. Loaded Schemas will be stored in tv4 cache upon first
   * load.
   *
   * @param {string} model the model for which to load the JSON Schema
   * @param {string} method the method for which the JSON Schema should be loaded
   * @returns {Promise<object>} the loaded JSON Schema
   */
  getSchema(model: string, method: string = 'get'): any {
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
        return this;
      })
      .then(() => {
        const link = this.getLink(`${this[shortIDSymbol]}:${model}`);

        if (link) {
          return link;
        }

        return this.dispatch(() =>
          get(this[environmentSymbol], this.newRequest().follow('self')).then(([res, traversal]) => {
            this[resourceSymbol] = halfred.parse(res);
            this[traversalSymbol] = traversal;

            const link = this.getLink(`${this[shortIDSymbol]}:${model}`);

            if (!link) {
              throw new Error(`Model ${model} not found.`);
            }

            return link;
          }),
        );
      })
      .then((link) => {
        link = link.profile;
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

        return getSchema(<string>link);
      });
  }

  /**
   * Create a single-use validation token for a user. The token should then be send to the user via mail and MUST NOT be displayed to her.
   *
   * @param {stirng} email The users email.
   */
  async getValidationToken(email: string): Promise<string> {
    if (!email) {
      throw new Error('email must be defined');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:_auth/api/validation-token`);
    request.withTemplateParameters({ email });
    const [response] = await this.dispatch(() => get(this[environmentSymbol], request));
    return response.validationToken;
  }

  /**
   * Login with email and password. Currently only supports `rest` clientID with body post of
   * credentials and tokenMethod `body`.
   *
   * @param {string} email email address of the user
   * @param {string} password password of the user
   * @returns {Promise<{access_token: string, refresh_token: string}>} Promise resolving to the issued token
   */
  login(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    return Promise.resolve()
      .then(() => {
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
        return this.dispatch(() => post(this[environmentSymbol], request, { email, password }));
      })
      .then(([tokenResponse]) => {
        if (tokenResponse.refresh_token) {
          this[tokenStoreSymbol].setRefreshToken(tokenResponse.refresh_token);
        }
        this[tokenStoreSymbol].setToken(tokenResponse.access_token || tokenResponse.token);
        this[eventsSymbol].emit('login', tokenResponse);
        return Promise.resolve(tokenResponse);
      });
  }

  /**
   * Login with token from magic link
   *
   * @param {{validationToken: string, useragent: stirng, ip: string}} body Login request body.
   * @returns {Promise<{access_token: string, refresh_token: string}>} Promise resolving to the issued token
   */
  async loginWithToken(body: {
    validationToken: string;
    userAgent?: string;
    ip?: string;
    clientID?: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    if (!body || typeof body !== 'object') {
      throw new Error('body must be defined');
    }
    if (!('validationToken' in body)) {
      throw new Error('validationToken must be defined in body');
    }

    const b: any = {};
    if (this[tokenStoreSymbol].hasClientID()) {
      Object.assign(b, { clientID: this[tokenStoreSymbol].getClientID() });
    }
    Object.assign(b, body);

    if (!b.clientID) {
      throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string) or sent in body');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:_auth/api/login-token`);
    const [response] = await this.dispatch(() => post(this[environmentSymbol], request, b));

    this[eventsSymbol].emit('login', response);
    return response;
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

        return this.follow(`${this[shortIDSymbol]}:_auth/logout`).then((request) => {
          request.withTemplateParameters({
            clientID: this[tokenStoreSymbol].getClientID(),
            token: this[tokenStoreSymbol].getToken(),
          });
          return this.dispatch(() => post(this[environmentSymbol], request));
        });
      })
      .then(() => {
        this[eventsSymbol].emit('logout');
        this[tokenStoreSymbol].deleteToken();
        return Promise.resolve();
      });
  }

  /**
   * Loads the account object of a public user.
   *
   * @param {boolean?} reload whether or not to force reload, default true
   * @returns {Promise<any>} Object account info
   */
  me(reload: boolean = true): Promise<any> {
    // TODO advanced type
    return Promise.resolve().then(() => {
      if (this[resourceSymbol] && this.account) {
        return this.account;
      }

      if (!this[tokenStoreSymbol].hasToken()) {
        throw new Error('No token stored. PublicAPI#me() unable to run.');
      }

      return this.resolve(reload).then(() => {
        if (this.account) {
          return this.account;
        }

        throw newError(402);
      });
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
    return this.resolve(reload).then(() => {
      const out = {};
      this.models.forEach((model) => {
        out[model.title] = model;
      });
      this[modelCacheSymbol] = out; // TODO is this needed?
      return out;
    });
  }

  /**
   * Call PublicAPI#refCount with model, field and desired ids to get a simple object with ref counts.
   *
   * @example
   * const counts = await api.refCount('myModel', 'myField', [entryID1, entryID2, ...entryIDn]);
   * alert(`Entry ${entryID1} has ${counts[entryID1]} references`);
   *
   * @param {string} model Model for which you want a ref count
   * @param {string} field Field for which you want a ref count
   * @param {Array<string>} ids Array of entry ids for which you want the ref count
   * @returns {object} Returns an object with entryID keys and number values
   */
  async refCount(model: string, field: string, ids: Array<string>): Promise<{ [key: string]: number }> {
    if (!model) {
      throw new Error('model must be defined');
    }

    if (!field) {
      throw new Error('field must be defined');
    }

    if (!ids || !Array.isArray(ids) || ids.some((i) => typeof i !== 'string')) {
      throw new Error('ids must be defined and an array of strings');
    }

    const idChunks = chunk(ids, 500);

    const res = await idChunks
      .map((idChunk) => async (results) => {
        const request = await this.follow('ec:api/dm-entryRefCount');
        request.withTemplateParameters({
          model,
          field,
          id: idChunk.join(','),
        });
        const [res] = await this.dispatch(() => get(this[environmentSymbol], request));
        return Object.assign(results, res);
      })
      .reduce((a, b) => a.then(b), Promise.resolve({}));

    return res;
  }

  /*
  /**
   * Creates a new History EventSource with the given filter options.
   *
   * @deprecated
   * 
   * @param {filterOptions | any} options The filter options
   * @return {Promise<EventSource>} The created EventSource.
   */
  /*
  newHistory(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:api/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return getHistory(this[environmentSymbol], request);
      });
  }

  /**
   * Creates a new HistoryEventsResource with past events.
   *
   * @deprecated
   *
   * @param {filterOptions?} options The filter options.
   * @returns {Promise<HistoryEventsResource} Event list of past events.
   */
  /*
  getPastEvents(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:api/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res]) => new HistoryEvents(res, this[environmentSymbol]));
  }
  */

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
      })
      .then((request) => {
        request.withTemplateParameters({
          clientID: this[tokenStoreSymbol].getClientID(),
          email,
        });
        return this.dispatch(() => getEmpty(this[environmentSymbol], request));
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

    return this.dispatch(() =>
      get(this[environmentSymbol], this.newRequest().follow('self')).then(([res, traversal]) => {
        this[resourceSymbol] = halfred.parse(res);
        this[traversalSymbol] = traversal;

        const assetGroups = Object.keys(this[resourceSymbol].allLinks()).filter(
          (x) => x.indexOf('ec:dm-assets/') !== -1,
        );

        const relations = {
          legacyAsset: {
            relation: 'ec:api/assets',
            createRelation: false,
            createTemplateModifier: '',
            id: 'assetID',
            ResourceClass: PublicAssetResource,
            ListClass: PublicAssetList,
          },
          tags: {
            relation: 'ec:api/tags',
            createRelation: false,
            createTemplateModifier: '',
            id: 'tag',
            ResourceClass: PublicTagResource,
            ListClass: PublicTagList,
          },
          authTokens: {
            relation: 'ec:dm-authtokens',
            createRelation: false,
            createTemplateModifier: '',
            id: 'hash',
            ResourceClass: DMAuthTokenResource,
            ListClass: DMAuthTokenList,
          },
        };
        assetGroups.forEach((relation) => {
          const relationName = `dmAsset.${relation.substr(13)}`;
          relations[relationName] = {
            relation,
            createRelation: false,
            createTemplateModifier: '',
            id: 'assetID',
            ResourceClass: DMAssetResource,
            ListClass: DMAssetList,
          };
        });
        this[resourceSymbol].models.forEach((model) => {
          relations[`model.${model.title}`] = {
            relation: `${this[shortIDSymbol]}:${model.title}`,
            createRelation: false, // TODO
            createTemplateModifier: '',
            id: '_id',
            resourceFunction: createEntry,
            listFunction: createList,
          };
        });

        this[relationsSymbol] = relations;

        return this;
      }),
    );
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

    this[tokenStoreSymbol].setClientID(clientID);
    return this;
  }

  /**
   * Signup a new account. Invite may be required.
   *
   * @example
   * return api.signup(email, password, invite)
   * .then((tokenResponse) => {
   *   api.setToken(tokenResponse.access_token);
   *   return show('Successfully registered account');
   * });
   *
   * @param {string} email email for the new account
   * @param {string} password password for the new account
   * @param {string?} invite optional invite. signup can be declined without invite.
   * @returns {Promise<{access_token: string, refresh_token: string}>} Promise resolving with the token
   */
  signup(email: string, password: string, invite?: string): Promise<{ access_token: string; refresh_token: string }> {
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
        return this.dispatch(() => post(this[environmentSymbol], request, { email, password }));
      })
      .then(([tokenResponse]) => {
        if (tokenResponse.refresh_token) {
          this[tokenStoreSymbol].setRefreshToken(tokenResponse.refresh_token);
        }
        this[tokenStoreSymbol].setToken(tokenResponse.access_token || tokenResponse.token);
        this[eventsSymbol].emit('signup', tokenResponse);
        return Promise.resolve(tokenResponse);
      });
  }

  /**
   * Load a single {@link PublicTagResource}.
   *
   * @example
   * return assetList.tag('thisOne')
   * .then(tag => {
   *   return show(tag);
   * });
   *
   * @param {string} tag the tag
   * @returns {Promise<PublicTagResource>} Promise resolving to PublicTagResource
   */
  tag(tag: string): Promise<PublicTagResource> {
    return Promise.resolve()
      .then(() => {
        if (!tag) {
          throw new Error('tag must be defined');
        }

        return this.follow('ec:api/tags');
      })
      .then((request) => {
        request.withTemplateParameters({ tag });
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new PublicTagResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load the {@link PublicTagList}.
   *
   * @example
   * return assetList.tagList()
   * .then(tags => {
   *   return tags.getAllItems().filter(tags => tag.tag === 'thisOne');
   * })
   * .then(tagsArray => {
   *   return show(tagsArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.tagList({
   *   filter: {
   *     assetID: 'thisOne',
   *   },
   * })
   * .then(tags => {
   *   return show(tags.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<PublicTagList>} Promise resolving to PublicTagList
   */
  tagList(options?: filterOptions | any): Promise<PublicTagList> {
    // TODO remove any
    return Promise.resolve()
      .then(() => {
        if (
          options &&
          Object.keys(options).length === 1 &&
          'tag' in options &&
          (typeof options.tag === 'string' || (!('any' in options.tag) && !('all' in options.tag)))
        ) {
          throw new Error('Cannot filter tagList only by tag. Use PublicAPI#tag() instead');
        }

        return this.follow('ec:api/tags');
      })
      .then((request) => {
        request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:api/tags').href));
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new PublicTagList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load the active sessions for the current user - the {@link DMAuthTokenList}.
   *
   * @example
   * const tokenList = await dm.tokenList();
   * await tokenList.map((token) => {
   *    // delete all sessions that are not the active one
   *    if (!token.isCurrent) {
   *      await token.delete();
   *    }
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMAuthTokenList>} Promise resolving to DMAuthTokenList
   */
  async tokenList(options?: filterOptions | any): Promise<DMAuthTokenList> {
    // TODO remove any
    return Promise.resolve()
      .then(() => {
        return this.follow('ec:dm-authtokens');
      })
      .then((request) => {
        request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:dm-authtokens').href));
        return this.dispatch(() => get(this[environmentSymbol], request));
      })
      .then(([res, traversal]) => new DMAuthTokenList(res, this[environmentSymbol], traversal));
  }

  /**
   * Validates a single-use token from a user. Checks if the token is valid and responds with user information.
   *
   * @param {string} validationToken Single-use token.
   */
  async validateValidationToken(validationToken: string): Promise<{
    accountID: string;
    email: string;
    hasPassword: boolean;
    pending: boolean;
  }> {
    if (!validationToken) {
      throw new Error('validationToken must be defined');
    }

    const request = await this.follow(`${this[shortIDSymbol]}:_auth/api/validate-token`);
    request.withTemplateParameters({ validationToken });
    const [response] = await this.dispatch(() => get(this[environmentSymbol], request));
    return response;
  }

  /**
   * Call PublicAPI#valueCount with model and field to get a simple array with value counts.
   *
   * @example
   * const values = await api.valueCount('myModel', 'myField');
   * alert(`Values are: ${values.map(x => `Value: ${x.value} (${x.count})`).join(', ')}`);
   *
   * @param {string} model Model for which you want a ref count
   * @param {string} field Field for which you want a ref count
   * @returns {Array<object>} Returns an array with values an their counts.
   */
  async valueCount(model: string, field: string): Promise<Array<{ value: any; count: number }>> {
    if (!model) {
      throw new Error('model must be defined');
    }

    if (!field) {
      throw new Error('field must be defined');
    }

    const request = await this.follow('ec:api/dm-entryValueCount');
    request.withTemplateParameters({
      model,
      field,
    });
    const [res] = await this.dispatch(() => get(this[environmentSymbol], request));
    return res;
  }
}

export type models = {
  [key: string]: fields;
};

export type fields = {
  [key: string]: fieldDefinition;
};

export type fieldDefinition = {
  title: string;
  description: string;
  type: string;
  readOnly: boolean;
  required: boolean;
  unique: boolean;
  localizable: boolean;
  mutable: boolean;
  validation: any;
  default: any;
  config: any;
  [key: string]: any;
};

export type fileOptions = {
  fileName?: string | Array<string>;
  preserveFilenames?: boolean;
  ignoreDuplicates?: boolean;
  includeAssetIDInPath?: boolean;
  deduplicate?: boolean;
  defaultVariants?: number | Array<number>;
};

export type jwtResponse = {
  jwt: string;
  accountID: string;
  iat: number;
  exp: number;
};

export type assetOptions = {
  fileName?: string | Array<string>;
  title?: string;
  tags?: Array<string>;
};

export enum imageType {
  PNG = 'png',
  JPEG = 'jpeg',
  WEBP = 'webp',
}

/**
 * When creating assets, you can provide some options like fileName and
 * others. These are directly mapped to DataManager options in the create Asset route.
 * Use them to influence fileNames, duplicate handling and generation of default image variants.
 *
 * @example
 * const assetList = await api.createDMAsset('myFiles', filePath, { deduplicate: true });
 *
 * @typedef {Object} fileOptions
 * @property {string | Array<string>} fileName - By default, a filename is generated using the original file's filename. Use this property to overwrite the filename – even sub-paths are possible this way. File extension has to be included, if desired. String Array if you upload multiple files at once.
 * @property {boolean=} preserveFilenames - set to `false` if you want a randomly generated filename. This way it is safe to set `includeAssetIDInPath` to `false` and get shorter URLs.
 * @property {boolean=} includeAssetIDInPath - set to `false` if you want shorter URls. If you have a conflicting filename, you'll get an error. Should therefore usually have the same value as `preserveFilenames`.
 * @property {boolean=} deduplicate - set to `true` to get back an already uploaded duplicate asset instead of an error, when the file already exists.
 * @property {boolean=} ignoreDuplicates - use if you don't want deduplication and you don't want to trigger an error if the file already exists. Normally it is better to just use the `deduplicate` flag instead.
 * @property {(number | Array<number>)=} defaultVariants - provide pixel value to generate an image variant right on upload. You'll get it back directly in the response, instead of after the first call.
 *
 */

/**
 * Collection of all models and their fields
 *
 * @typedef {Object} models
 * @property {field} modelName
 */

/**
 * Collection of all fields and their fieldDefinition
 *
 * @typedef {Object} fields
 * @property {fieldDefinition} fieldName
 */

/**
 * A field definitions is the public version of model field config with field specific configs used in ec.forms.
 *
 * @typedef {Object} fieldDefinition
 * @property {string} title
 * @property {string} description
 * @property {string} type
 * @property {boolean} readOnly
 * @property {boolean} required
 * @property {boolean} unique
 * @property {boolean} localizable
 * @property {boolean} mutable
 * @property {any} validation
 * @property {any} default
 * @property {object} config
 */
