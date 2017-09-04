import * as traverson from 'traverson';
import * as HalAdapter from 'traverson-hal';
import * as halfred from 'halfred';

import events from './EventEmitter';
import TokenStoreFactory from './TokenStore';
import { get, getSchema } from './helper';

const resourceSymbol = Symbol.for('resource');
const tokenStoreSymbol = Symbol.for('tokenStore');
const traversalSymbol = Symbol.for('traversal');
const eventsSymbol = Symbol.for('events');
const environmentSymbol = Symbol.for('environment');

traverson['registerMediaType'](HalAdapter.mediaType, HalAdapter);

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
 * Each API connector Class inherits directly from Core class. You cannot instantiate Core
 * directly. Use one of the other API connectors instead.
 *
 * @access protected
 *
 * @class
 */
export default class Core {
  constructor(urls: any, environment: environment = 'live', cookieModifier?: string) {
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
  }

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
   * // A new token was received: <aJwtToken> will be logged
   *
   * @param {string} label the event type
   * @param {function} listener the listener
   * @returns {undefined}
   */
  on(label: string, listener: any) {
    return this[eventsSymbol].on(label, listener);
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
   * You can remov a previously attached listener from the underlying {@link EventEmitter} with
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
   * If you want to add additional information to the user agent used bed ec.sdk you can use this
   * function to add any string.
   *
   * @example
   * accounts.setUserAgent('editor/0.15.3 (a comment)');
   * // all subsequent requests will have user agent: editor/0.15.3 (a comment) ec.sdk/<version>
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
}

export type environment = 'live' | 'stage' | 'nightly' | 'develop';
