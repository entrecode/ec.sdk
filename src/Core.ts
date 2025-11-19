import 'es6-symbol/implement';
import * as traverson from 'traverson';
import * as HalAdapter from 'traverson-hal';
import * as halfred from 'halfred';
import * as validator from 'json-schema-remote';
import * as shortID from 'shortid';
import * as jwtDecode from 'jwt-decode';

const { convertValidationError } = require('ec.errors')();

import { EventEmitterFactory } from './EventEmitter';
import TokenStoreFactory from './TokenStore';
import { locale, setLocale, get, getSchema, optionsToQuery, post, enableHistoryEvents, del } from './helper';
import Resource from './resources/Resource';
import ListResource, { FilterOptions } from './resources/ListResource';
import Problem from './Problem';

const resourceSymbol: any = Symbol.for('resource');
const tokenStoreSymbol: any = Symbol.for('tokenStore');
const traversalSymbol: any = Symbol.for('traversal');
const eventsSymbol: any = Symbol.for('events');
const environmentSymbol: any = Symbol.for('environment');
const relationsSymbol: any = Symbol.for('relations');
const cookieModifierSymbol: any = Symbol.for('cookieModifier');
const initPromiseSymbol: any = Symbol.for('initPromise');

traverson['registerMediaType'](HalAdapter.mediaType, HalAdapter);

validator.setLoggingFunction(() => {});

/**
 * Each API connector Class inherits directly from Core class. You cannot instantiate Core
 * directly. Use one of the other API connectors instead.
 *
 * @example
 * // will share token for 'userA'
 * const dmUserA = new DataManager({ environment: 'live', cookieModifier: 'userA' });
 * const apiUserA = new PublicAPI(shortID, { environment: 'live', cookieModifier: 'userA' }, true);
 *
 * // will share token for 'userB'
 * const dmUserB = new DataManager({ environment: 'live', cookieModifier: 'userB' });
 * const apiUserB = new PublicAPI(shortID, { environment: 'live', cookieModifier: 'userB' }, true);
 *
 * // will not share token and not save it in cookie as well
 * const dmStandAlone = new DataManager({ environment: 'live', noCookie: true });
 *
 *
 * @protected
 * @class
 *
 * @param {object} urls Object with URLs for each environment (key: environment, value: url)
 * @param {environment} environment The environment to connect to
 * @param {string?} cookieModifier An optional modifier for the cookie name (used by
 *   {@link PublicAPI}
 */
export default class Core {
  // constructor(urls: any, environment: environment = 'live', cookieModifier: string = '') {
  constructor(urls: any, envOrOptions: options | environment = 'live') {
    let environment;
    let cookieModifier = '';

    if (typeof envOrOptions === 'string') {
      environment = envOrOptions;
    } else {
      environment = envOrOptions.environment || 'live';
      if (envOrOptions.cookieModifier) {
        cookieModifier += envOrOptions.cookieModifier;
      }
      if (envOrOptions.noCookie) {
        cookieModifier += shortID.generate();
      }
    }

    if (!urls) {
      throw new Error('urls must be defined');
    }

    if (!(environment in urls)) {
      const foundOne = Object.keys(urls).find((urlKey) => environment.indexOf(urlKey) !== -1);
      if (foundOne) {
        environment = foundOne;
        cookieModifier += shortID.generate();
      } else {
        throw new Error('invalid environment specified');
      }
    }

    this[environmentSymbol] = environment + cookieModifier;
    this[eventsSymbol] = EventEmitterFactory(this[environmentSymbol]);
    this[cookieModifierSymbol] = cookieModifier;
    this[tokenStoreSymbol] = TokenStoreFactory(environment + cookieModifier);
    this[traversalSymbol] = traverson.from(urls[environment]).jsonHal();
    this[relationsSymbol] = {};
  }

  /**
   * Static function to globally enable history events. If you want to use history events please
   * provide 'eventsource/lib/eventsource-polyfill' within your project.
   *
   * @example
   * import { PublicAPI } from 'ec.sdk';
   * import * as EventSource from 'eventsource/lib/eventsource-polyfill';
   *
   * PublicAPI.enableHistoryEvents(EventSource);
   * …
   *
   * @param eventstoreLib
   */
  static enableHistoryEvents(eventstoreLib: any): void {
    enableHistoryEvents(eventstoreLib);
  }

  /**
   * Check if we can refresh a token
   *
   * @returns {boolean} Wether or not the refreshal can be performed.
   */
  canRefreshToken(): boolean {
    return this[tokenStoreSymbol].hasRefreshToken();
  }

  /**
   * Create a new Resource. Note: Not all relations will support this.
   *
   * @example
   * return accounts.create('client', {
   *   clientID: 'myClient',
   *   callbackURL: 'https://example.com/login',
   *   config: {
   *     tokenMethod: 'query',
   *   },
   * })
   * .then(client => show(client));
   *
   * @param {string} relation The shortened relation name
   * @param {object} resource object representing the resource
   * @param {boolean} returnList override Resource creation with List creation.
   * @returns {Promise<Resource>} the newly created Resource
   */
  create(relation: string, resource: any, returnList = false): Promise<Resource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }
        if (!this[relationsSymbol][relation].createRelation) {
          throw new Error('Resource has no createRelation');
        }
        if (!resource) {
          throw new Error('Cannot create resource with undefined object.');
        }
        if (this[relationsSymbol][relation].createTransform) {
          resource = this[relationsSymbol][relation].createTransform(resource);
        }
        return this.link(this[relationsSymbol][relation].createRelation);
      })
      .then((link) =>
        validator
          .validate(resource, `${link.profile}${this[relationsSymbol][relation].createTemplateModifier}`)
          .catch((e) => {
            throw new Problem(convertValidationError(e), locale);
          }),
      )
      .then(() => this.follow(this[relationsSymbol][relation].relation))
      .then((request) => {
        if (this[relationsSymbol][relation].additionalTemplateParam) {
          request.withTemplateParameters(
            optionsToQuery({
              [this[relationsSymbol][relation].additionalTemplateParam]:
                this[this[relationsSymbol][relation].additionalTemplateParam],
            }),
          );
        }
        return post(this[environmentSymbol], request, resource);
      })
      .then(([c, traversal]) => {
        let ResourceConstructor;
        if (returnList || this[relationsSymbol][relation].returnList) {
          ResourceConstructor = this[relationsSymbol][relation].ListClass;
        } else {
          ResourceConstructor = this[relationsSymbol][relation].ResourceClass;
        }
        return <Resource>new ResourceConstructor(c, this[environmentSymbol], traversal);
      });
  }

  /**
   * Delete a single {@link Resource} identified by resourceID.
   *
   * @example
   * return accounts.deleteResource('account', me.accountID)
   * .then(()) => alert('Account deleted'));
   *
   * @param {string} relation The shortened relation name
   * @param {string} resourceID id of the Resource
   * @returns {Promise<undefined>} resolves when Resource could be deleted
   */
  async deleteResource(relation: string, resourceID: string, additionalTemplateParams: any = {}): Promise<void> {
    if (!relation) {
      throw new Error('relation must be defined');
    }
    if (!this[relationsSymbol][relation]) {
      throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
    }
    if (!resourceID) {
      throw new Error('resourceID must be defined');
    }

    const request = await this.follow(this[relationsSymbol][relation].relation);
    if (
      this[relationsSymbol][relation].additionalTemplateParam &&
      !(this[relationsSymbol][relation].additionalTemplateParam in additionalTemplateParams)
    ) {
      additionalTemplateParams[this[relationsSymbol][relation].additionalTemplateParam] =
        this[this[relationsSymbol][relation].additionalTemplateParam];
    }
    const params = Object.assign({}, additionalTemplateParams, {
      [this[relationsSymbol][relation].id]: resourceID,
    });
    request.withTemplateParameters(params);
    await del(this[environmentSymbol], request);
  }

  /**
   * Dispatch a request for helper lib. This will handle token refreshal on every request and on 401 errors
   *
   * @param {function} fkt A function returning a Promise from any network helper in helper.js
   */
  async dispatch(fkt): Promise<any> {
    if (this.timeToRefresh()) {
      console.log('Refreshing token…');
      this.doRefreshToken()
        .then(() => {
          console.log('… successfully refreshed');
        })
        .catch((err) => {
          console.warn(`Error refreshing: ${err.message}`);
        });
    }

    const trace = new Error('message').stack || 'message';
    try {
      return await fkt().catch((err) => {
        err.originalStack = err.stack;
        err.stack = trace.replace('message', err.message);
        throw err;
      });
    } catch (err) {
      if (err.status !== 401 || !this.canRefreshToken()) {
        throw err;
      }
      return this.doRefreshToken()
        .catch((innerErr) => {
          console.warn(`Could not refresh token: ${innerErr.message}`);
          // Error refreshing, raise first error;
          throw err;
        })
        .then(() => fkt());
    }
  }

  /**
   * `Abstract interface` for PublicAPI#doRefreshToken. Exists until Accountserver has token refreshal of its own.
   *
   * @returns {{access_token: string, refresh_token?: string, token_type: string, expires_in: number}} Returns the new token response on successful refresh
   */
  async doRefreshToken(): Promise<
    { access_token: string; refresh_token?: string; token_type: string; expires_in: number } | undefined
  > {
    throw new Error('only supported on PublicAPI');
  }

  /**
   * Returns a traverson request builder following the provided link. If the link is not present in
   * the root resource it will try to reload the root resource. This is done since links can
   * appear/disappear when login state changes.
   *
   * @param {string} link The link to follow
   * @returns {Promise<any>} Promise resolving to traverson request builder
   */
  follow(link: string): Promise<any> {
    return Promise.resolve().then(() => {
      // If the resource and traversal are already set, return the request builder.
      // When the cached result does not contain the link, it will be reloaded below.
      if (this[resourceSymbol] && this[traversalSymbol] && this.getLink(link) !== null) {
        return this.newRequest().follow(link);
      }

      // Check if there's already a pending initialization promise
      if (!this[initPromiseSymbol]) {
        // Create and cache the initialization promise
        this[initPromiseSymbol] = get(this[environmentSymbol], this.newRequest())
          .then(([res, traversal]) => {
            this[resourceSymbol] = halfred.parse(res);
            this[traversalSymbol] = traversal;
            // Clear the cached promise once resolved
            this[initPromiseSymbol] = null;
          })
          .catch((err) => {
            // Clear the cached promise on error so subsequent calls can retry
            this[initPromiseSymbol] = null;
            throw err;
          });
      }

      return this[initPromiseSymbol].then(() => {
        if (this[resourceSymbol].link(link) === null) {
          throw new Error(`Could not follow ${link}. Link not present in root response.`);
        }

        return this.newRequest().follow(link);
      });
    });
  }

  /**
   * Returns a collection of available relations in this API Connector.
   *
   * @return {object} Collection of available relations
   */
  getAvailableRelations(): any {
    const out = {};
    // Optimize: Use for...of loop instead of forEach for better performance
    for (const rel of Object.keys(this[relationsSymbol])) {
      out[rel] = {
        id: this[relationsSymbol][rel].id,
        createable: !!this[relationsSymbol][rel].createRelation,
      };
    }
    return out;
  }

  /**
   * Get a list of all avaliable filter options for a given relation.
   *
   * @param {string} relation The shortened relation name
   * @returns {Promise<Array<string>>} resolves to an array of avaliable filter options (query string notation).
   */
  getFilterOptions(relation: string): Promise<any> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }
        return this.newRequest();
      })
      .then((request) => get(this[environmentSymbol], request))
      .then(([res]) => {
        let link = halfred.parse(res).link(this[relationsSymbol][relation].relation);
        const matchResults = link.href.match(/{[^}]*}/g);
        if (matchResults) {
          return matchResults
            .map((result) => {
              const res = /^{[?&]([^}]+)}$/.exec(result);
              if (res) {
                return res[1].split(',');
              }
              return [];
            })
            .reduce((a, b) => a.concat(b), []);
        }
      });
  }

  /**
   * Get a given link from the root resource
   * @param {string} link
   * @returns {any} link object
   */
  getLink(link: string): any {
    return this[resourceSymbol].link(link);
  }
  /**
   * If you want to have access to the currently used refresh token you can call this function.
   *
   * @example
   * console.log(accounts.getRefreshToken()); // will log current refresh token
   *
   * @returns {string} currently used refresh token
   */
  getRefreshToken(): string {
    return this[tokenStoreSymbol].getRefreshToken();
  }

  /**
   * If you want to have access to the currently used token you can call this function.
   *
   * @example
   * console.log(accounts.getToken()); // will log current token
   *
   * @returns {string} currently used token
   */
  getToken(): string {
    return this[tokenStoreSymbol].getToken();
  }

  /**
   * Check if a access token is stored
   *
   * @example
   * console.log(accounts.hasToken()); // will log true or false
   *
   * @returns {boolean} currently used token
   */
  hasToken(): boolean {
    return this[tokenStoreSymbol].hasToken();
  }

  /**
   * Check if a refresh token is stored
   *
   * @example
   * console.log(accounts.hasRefreshToken()); // will log true or false
   *
   * @returns {boolean} currently used token
   */
  hasRefreshToken(): boolean {
    return this[tokenStoreSymbol].hasRefreshToken();
  }

  link(link: string): Promise<any> {
    return Promise.resolve().then(() => {
      if (this[resourceSymbol] && this[traversalSymbol] && this[resourceSymbol].link(link) !== null) {
        return this[resourceSymbol].link(link);
      }

      return get(this[environmentSymbol], this.newRequest()).then(([res, traversal]) => {
        this[resourceSymbol] = halfred.parse(res);
        this[traversalSymbol] = traversal;

        if (this[resourceSymbol].link(link) === null) {
          throw new Error(`Could not get ${link}. Link not present in root response.`);
        }

        return this[resourceSymbol].link(link);
      });
    });
  }

  /**
   * Creates a new {@link
   * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
   * traverson request builder}
   *  which can be used for a new request to the API.
   *
   * @access private
   *
   * @returns {Object} traverson request builder instance.
   */
  newRequest(): any {
    if (!this[traversalSymbol]) {
      throw new Error('Critical: Traversal invalid!');
    }

    if ('continue' in this[traversalSymbol]) {
      return this[traversalSymbol].continue().newRequest();
    }

    return this[traversalSymbol].newRequest();
  }

  /**
   * All API connectors have an underlying {@link EventEmitter} for emitting events. You can use
   * this function for attaching an event listener. See {@link EventEmitter} for the events which
   * will be emitted.
   *
   * @example
   * function myAlertFunc(string){
   *   console.log(`A new token was received: ${string}`);
   * }
   *
   * session.on('login', myAlertFunc);
   * session.login(email, password);
   * // "A new token was received: <aJwtToken>" will be logged
   *
   * @param {string} label the event type
   * @param {function} listener the listener
   */
  on(label: string, listener: any) {
    this[eventsSymbol].on(label, listener);
  }

  /**
   * This function preloads all schemas identified by schemas property.
   *
   * @param {string|Array<string>} schemas JSONSchema URL or array of JSONSchema URLs
   * @returns {Promise<undefined>} Promise resolving when all schemas are successfully loaded.
   */
  preloadSchemas(schemas: string | Array<string>): Promise<void> {
    return Promise.resolve()
      .then(() => {
        if (typeof schemas === 'string') {
          schemas = <Array<string>>[schemas];
        }

        return (<Array<string>>schemas)
          .map((schema) => getSchema(schema))
          .reduce((a, b) => a.then(b), Promise.resolve());
      })
      .then(() => Promise.resolve());
  }

  /**
   * You can remove a previously attached listener from the underlying {@link EventEmitter} with
   * this function.
   *
   * @example
   * session.on('login', myAlertFunc);
   * session.login(email, password)
   * .then(token => {  // myAlertFunc will be called with token
   *   console.log(token);
   *   session.removeListener('login', myAlertFunc);
   *   // myAlertFunc will no longer be called.
   * });
   *
   * @param {string} label the event type
   * @param {function} listener the listener
   * @returns {boolean} whether or not the listener was removed
   */
  removeListener(label: string, listener: any) {
    return this[eventsSymbol].removeListener(label, listener);
  }

  /**
   * Get a single {@link Resource} identified by resourceID.
   *
   * @example
   * return accounts.resource('account', me.accountID)
   * .then(account => show(account.email));
   *
   * @param {string} relation The shortened relation name
   * @param {string} resourceID id of the Resource
   * @returns {Promise<Resource>} resolves to the Resource which should be loaded
   */
  resource(relation: string, resourceID, additionalTemplateParams: any = {}): Promise<Resource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }
        if (!resourceID) {
          throw new Error('resourceID must be defined');
        }

        return this.follow(this[relationsSymbol][relation].relation);
      })
      .then((request) => {
        if (
          this[relationsSymbol][relation].additionalTemplateParam &&
          !(this[relationsSymbol][relation].additionalTemplateParam in additionalTemplateParams)
        ) {
          additionalTemplateParams[this[relationsSymbol][relation].additionalTemplateParam] =
            this[this[relationsSymbol][relation].additionalTemplateParam];
        }
        const params = Object.assign({}, additionalTemplateParams, {
          [this[relationsSymbol][relation].id]: resourceID,
        });
        request.withTemplateParameters(params);
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => {
        if (this[relationsSymbol][relation].resourceFunction) {
          return this[relationsSymbol][relation].resourceFunction(res, this[environmentSymbol], traversal);
        }

        if (this[relationsSymbol][relation].singleIsList) {
          return new this[relationsSymbol][relation].ListClass(res, this[environmentSymbol], traversal).getFirstItem();
        }

        return new this[relationsSymbol][relation].ResourceClass(res, this[environmentSymbol], traversal);
      });
  }

  /**
   * Load a {@link ListResource} of {@link Resource}s filtered by the values specified by the
   * options parameter.
   *
   * @example
   * return accounts.resourceList('account', {
   *   filter: {
   *     created: {
   *       from: new Date(new Date.getTime() - 600000).toISOString()),
   *     },
   *   },
   * })
   * .then(list => show(list))
   *
   * @param {string} relation The shortened relation name
   * @param {filterOptions?} options the filter options
   * @param {object} additionalTemplateParams additional template parameters to apply
   * @returns {Promise<ListResource>} resolves to resource list with applied filters
   */
  resourceList(
    relation: string,
    options: FilterOptions | any = {},
    additionalTemplateParams: any = {},
  ): Promise<ListResource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }

        const id = this[relationsSymbol][relation].id;
        if (
          options &&
          Object.keys(options).length === 1 &&
          id in options &&
          (typeof options[id] === 'string' || 'exact' in options[id])
        ) {
          throw new Error('Providing only an id in ResourceList filter will result in single resource response.');
        }

        if (options && '_levels' in options) {
          throw new Error('_levels on list resources not supported');
        }

        if (!options) {
          options = {};
        }
        if (!this[relationsSymbol][relation].doNotSendList) {
          options._list = true;
        }
        return this.follow(this[relationsSymbol][relation].relation);
      })
      .then((request) => {
        if (
          this[relationsSymbol][relation].additionalTemplateParam &&
          !(this[relationsSymbol][relation].additionalTemplateParam in additionalTemplateParams)
        ) {
          additionalTemplateParams[this[relationsSymbol][relation].additionalTemplateParam] =
            this[this[relationsSymbol][relation].additionalTemplateParam];
        }
        const params = Object.assign({}, additionalTemplateParams, options);
        request.withTemplateParameters(
          optionsToQuery(params, this.getLink(this[relationsSymbol][relation].relation).href),
        );
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => {
        if (this[relationsSymbol][relation].listFunction) {
          return this[relationsSymbol][relation].listFunction(res, this[environmentSymbol], traversal);
        }

        return new this[relationsSymbol][relation].ListClass(res, this[environmentSymbol], traversal);
      });
  }

  /**
   * If you have an existing access token you can use it by calling this function. All
   * subsequent requests will use the provided {@link https://jwt.io/ Json Web Token} with an
   * Authorization header.
   *
   * @example
   * return accounts.me(); // will result in error
   * accounts.setToken('aJwtToken');
   * return accounts.mes(); // will resolve
   *
   * @param {string} token the existing token
   * @param {string} refreshToken the existing refresh token
   * @returns {Core} this for chainability
   */
  setToken(token: string, refreshToken?: string): Core {
    if (!token) {
      throw new Error('Token must be defined');
    }

    this[tokenStoreSymbol].setToken(token);

    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }

    return this;
  }

  /**
   * If you have an existing refresh token you can use it by calling this function.
   * It will be used to get a new token when time comes.
   *
   * @example
   * return accounts.me(); // will result in error
   * accounts.setToken('aJwtToken');
   * accounts.setRefreshToken('anotherJwtToken');
   * return accounts.me(); // will resolve
   *
   * @param {string} token the existing token
   * @returns {Core} this for chainability
   */
  setRefreshToken(token: string): Core {
    if (!token) {
      throw new Error('Token must be defined');
    }

    this[tokenStoreSymbol].setRefreshToken(token);
    return this;
  }

  /**
   * If you want to add additional information to the user agent used by ec.sdk you can use this
   * function to add any string.
   *
   * @example
   * accounts.setUserAgent('editor/0.15.3 (a comment)');
   * // all subsequent requests will use x-user-agent: editor/0.15.3 (a comment) ec.sdk/<version>
   *
   * @param {string} agent the user agent to add
   * @return {Core} this for chainability
   */
  setUserAgent(agent: string): Core {
    if (!agent) {
      throw new Error('agent must be defined');
    }

    this[tokenStoreSymbol].setUserAgent(agent);
    return this;
  }

  /**
   * Set the global locale for error output. 'de' and 'en' are available.
   */
  setLocale(globalLocale: string = 'en'): Core {
    setLocale(globalLocale);
    return this;
  }

  /**
   * Check if we have a refresh token and if it is time (token expiraion < 24h) to refresh the token
   *
   * @returns {boolean} Wether or not the refreshal should be performed.
   */
  timeToRefresh(): boolean {
    if (!this[tokenStoreSymbol].hasRefreshToken()) {
      // no refresh token -> no refresh
      return false;
    }

    if (!this[tokenStoreSymbol].hasToken()) {
      // refresh token but no token -> refresh (outdated and deleted token)
      return true;
    }

    const token = this[tokenStoreSymbol].getToken();
    let decoded: any;

    try {
      decoded = jwtDecode(token);

      if (decoded.iss.indexOf('entrecode') !== -1) {
        // This is an accountserver token. No refresh for now;
        return false;
      }

      const now = new Date();

      if (now.getTime() + 60 * 60 * 24 * 1000 > decoded.exp * 1000) {
        return true;
      }

      return false;
    } catch (err) {
      throw new Error('Malformed token');
    }
  }
}

export type environment = 'live' | 'stage' | 'nightly' | 'develop';

export type options = { environment?: environment; noCookie?: boolean; cookieModifier?: string; ecUser?: boolean };

/**
 * You can define which API should be used with the environment parameter. Internally this is also
 * used as key to store tokens into cookies (for browsers).
 *
 * Valid value is one of `live`, `stage`, `nightly`, or `develop`.
 *
 * @example
 * // will connect to production https://editor.entrecode.de
 * const session = new Session('live');
 * // will connect to cachena https://editor.cachena.entrecode.de
 * const accounts = new Accounts('stage');
 * // will connect to buffalo https://editor.buffalo.entrecode.de
 * const dataManager = new DataManager('nightly');
 * // will connect to your local instances, well maybe
 * const accounts = new Accounts('develop');
 *
 * @typedef { 'live' | 'stage' | 'nightly' | 'develop'} environment
 */

/**
 * In node context it is advised to configure token handling more specifically. Normally ec.sdk will share
 * a given token with other API Connectors (see {@link Core}), in most cases this is not desired in node
 * scripts. By providing an options object instead of an {@link environment} string when creating the API
 * Conenctor you can overwrite the handling.
 *
 * @example
 * // will not share any token with other API connectors (token name is appended with a generated shortID)
 * new PublicAPI('beefbeef', { noCookie: true });
 *
 * // will share token with all `userA` PublicAPI Connectors for 'beefbeef'
 * new PublicAPI('beefbeef', { cookieModifier: 'userA' });
 *
 * // will share token with all `userA` API Connectors, even DataManager and so on
 * new PublicAPI('beefbeef', { cookieModifier: 'userA', ecUser: true });
 * // same
 * new PublicAPI('beefbeef', { cookieModifier: 'userA' }, true);
 *
 * // will share token with all PublicAPI Connectors for 'beefbeef'
 * new PublicAPI('beefbeef')
 *
 * // will share token with all API connectors
 * new PublicAPI('beefbeef', { ecUser: true });
 * // same
 * new PublicAPI('beefbeef', 'live', true);
 *
 * @typedef {Object} options
 * @property {environment} environment The environment for the API Connector
 * @property {boolean} noCookie True if you want to token-handling disabled (will overwrite Tokenstore name with random string)
 * @property {string} cookieModifier Define a string for sharing multiple tokens.
 * @property {boolean} ecUser True if the user is a ecUser. PublicAPI API Connectors will share across all shortIDs.
 */
