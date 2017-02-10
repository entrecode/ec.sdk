import traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import TokenStoreFactory from './TokenStore';
import events from './EventEmitter';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

/**
 * Core class for connecting to any entrecode API.
 *
 * @interface
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
   * Set an existing accessToken
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
   * Attaches a listener on the underlying EventEmitter.
   *
   * @param {string} label the event type
   * @param {function} listener the listener
   * @returns {undefined}
   */
  on(label, listener) {
    return this.events.on(label, listener);
  }

  /**
   * Removes a previously attached listener from the underlying EventEmitter.
   *
   * @param {string} label the event type
   * @param {function} listener the listener
   * @returns {boolean} whether or not the listener was removed
   */
  removeListener(label, listener) {
    return this.events.removeListener(label, listener);
  }
}
