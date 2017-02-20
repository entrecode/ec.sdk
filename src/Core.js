import traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import TokenStoreFactory from './TokenStore';
import events from './EventEmitter';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

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
  constructor(url) {
    if (!url) {
      throw new Error('url must be defined');
    }

    this.events = events;
    this.tokenStore = TokenStoreFactory('live');
    this.traversal = traverson.from(url).jsonHal()
    .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
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
  newRequest() {
    if (!this.traversal) {
      throw new Error('Critical: Traversal invalid!');
    }

    if ({}.hasOwnProperty.call(this.traversal, 'continue')) {
      return this.traversal.continue().newRequest();
    }

    return this.traversal.newRequest();
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
  setToken(token) {
    if (!token) {
      throw new Error('Token must be defined');
    }

    this.tokenStore.set(token);
    return this;
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
  on(label, listener) {
    return this.events.on(label, listener);
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
  removeListener(label, listener) {
    return this.events.removeListener(label, listener);
  }
}
