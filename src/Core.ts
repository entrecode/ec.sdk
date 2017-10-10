import * as traverson from 'traverson';
import * as HalAdapter from 'traverson-hal';
import * as halfred from 'halfred';
import * as validator from 'json-schema-remote';

import events from './EventEmitter';
import TokenStoreFactory from './TokenStore';
import { get, getSchema, optionsToQuery, post } from './helper';
import Resource from './resources/Resource';
import ListResource, { filterOptions } from './resources/ListResource';

const resourceSymbol = Symbol.for('resource');
const tokenStoreSymbol = Symbol.for('tokenStore');
const traversalSymbol = Symbol.for('traversal');
const eventsSymbol = Symbol.for('events');
const environmentSymbol = Symbol.for('environment');
const relationsSymbol = Symbol.for('relations');

traverson['registerMediaType'](HalAdapter.mediaType, HalAdapter);

/**
 * Each API connector Class inherits directly from Core class. You cannot instantiate Core
 * directly. Use one of the other API connectors instead.
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
  constructor(urls: any, environment: environment = 'live', cookieModifier: string = '') {
    if (!urls) {
      throw new Error('urls must be defined');
    }

    if (!(environment in urls)) {
      throw new Error('invalid environment specified');
    }

    this[eventsSymbol] = events;
    this[environmentSymbol] = environment + cookieModifier;
    this[tokenStoreSymbol] = TokenStoreFactory(environment + cookieModifier);
    this[traversalSymbol] = traverson.from(urls[environment]).jsonHal();
    this[relationsSymbol] = { dummy: {} };
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
    return Promise.resolve()
    .then(() => {
      if (this[resourceSymbol] && this[traversalSymbol] && this.getLink(link) !== null) {
        return this.newRequest().follow(link);
      }

      return get(this[environmentSymbol], this.newRequest().follow('self'))
      .then(([res, traversal]) => {
        this[resourceSymbol] = halfred.parse(res);
        this[traversalSymbol] = traversal;

        if (this[resourceSymbol].link(link) === null) {
          throw new Error(`Could not follow ${link}. Link not present in root response.`);
        }

        return this.newRequest().follow(link);
      });
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

  link(link: string): Promise<any> {
    return Promise.resolve()
    .then(() => {
      if (this[resourceSymbol] && this[traversalSymbol] && this[resourceSymbol].link(link) !== null) {
        return this[resourceSymbol].link(link);
      }

      return get(this[environmentSymbol], this.newRequest())
      .then(([res, traversal]) => {
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

      return (<Array<string>>schemas).map(schema => getSchema(schema))
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
   * @returns {Core} this for chainability
   */
  setToken(token: string): Core {
    if (!token) {
      throw new Error('Token must be defined');
    }

    this[tokenStoreSymbol].setToken(token);
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
  resource(relation: string, resourceID): Promise<Resource> {
    return Promise.resolve()
    .then(() => {
      if (!relation) {
        throw new Error('relation must be defined');
      }
      if (!this[relationsSymbol][relation]) {
        throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`)
      }
      if (!resourceID) {
        throw new Error('resourceID must be defined');
      }

      return this.follow(this[relationsSymbol][relation].relation)
    })
    .then((request) => {
      request.withTemplateParameters({ [this[relationsSymbol][relation].id]: resourceID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) =>
      new this[relationsSymbol][relation].ResourceClass(res, this[environmentSymbol], traversal));
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
   * @returns {Promise<ListResource>} resolves to resource list with applied filters
   */
  resourceList(relation: string, options?: filterOptions | any): Promise<ListResource> {
    return Promise.resolve()
    .then(() => {
      if (!relation) {
        throw new Error('relation must be defined');
      }
      if (!this[relationsSymbol][relation]) {
        throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`)
      }

      const id = this[relationsSymbol][relation].id;
      if (
        options && Object.keys(options).length === 1 && id in options
        && (typeof options[id] === 'string' || (!('any' in options[id] && !('all' in options[id]))))
      ) {
        throw new Error('Providing only an id in ResourceList filter will result in single resource response.');
      }

      if (options && '_levels' in options) {
        throw new Error('_levels on list resources not supported');
      }

      return this.follow(this[relationsSymbol][relation].relation);
    })
    .then((request) => {
      if (options) {
        request.withTemplateParameters(
          optionsToQuery(options, this.getLink(this[relationsSymbol][relation].relation).href));
      }
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) =>
      new this[relationsSymbol][relation].ListClass(res, this[environmentSymbol], traversal));
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
   * @returns {Promise<Resource>} the newly created Resource
   */
  create(relation: string, resource: any): Promise<Resource> {
    return Promise.resolve()
    .then(() => {
      if (!relation) {
        throw new Error('relation must be defined');
      }
      if (!this[relationsSymbol][relation]) {
        throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`)
      }
      if (!this[relationsSymbol][relation].createRelation) {
        throw new Error('Resource has no createRelation');
      }
      if (!resource) {
        throw new Error('Cannot create resource with undefined object.');
      }
      return this.link(this[relationsSymbol][relation].createRelation);
    })
    .then(link => validator.validate(resource, `${link.profile}${this[relationsSymbol][relation].createTemplateModifier}`))
    .then(() => this.follow(this[relationsSymbol][relation].relation))
    .then(request => {
      request.withTemplateParameters({});
      return post(this[environmentSymbol], request, resource)
    })
    .then(([c, traversal]) =>
      new this[relationsSymbol][relation].ResourceClass(c, this[environmentSymbol], traversal));
  }
}

export type environment = 'live' | 'stage' | 'nightly' | 'develop';

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

