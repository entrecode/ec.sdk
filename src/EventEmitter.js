/**
 * EventEmitter for emitting all received errors from any API.
 *
 * @class
 * @access private
 */
class EventEmitter {
  /**
   * default constructor initialising a empty {@link Map} for event listeners.
   *
   * @access private
   */
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Adds a listener for an event type.
   *
   * @access private
   *
   * @param {string} label event type
   * @param {function} callback function to invoke when event occurs.
   * @returns {undefined}
   */
  addListener(label, callback) {
    if (!this.listeners.has(label)) {
      this.listeners.set(label, []);
    }
    this.listeners.get(label).push(callback);
  }

  /**
   * Adds a listener for an event type.
   *
   * @access private
   *
   * @param {string} label event type
   * @param {function} callback function to invoke when event occurs.
   * @returns {undefined}
   */
  on(label, callback) {
    this.addListener(label, callback);
  }

  /**
   * Removes a listener.
   *
   * @access private
   *
   * @param {string} label event type
   * @param {function} callback listener function to remove.
   * @returns {boolean} whether or not the listener got removed.
   */
  removeListener(label, callback) {
    const listeners = this.listeners.get(label);
    if (!listeners || listeners.length === 0) {
      return false;
    }
    const index = listeners.indexOf(callback);
    let ret;
    if (index > -1) {
      listeners.splice(index, 1);
      ret = true;
    } else {
      ret = false;
    }
    this.listeners.set(label, listeners);
    return ret;
  }

  /**
   * Removes all listeners for a given label.
   *
   * @access private
   *
   * @param {string} label event type.
   * @returns {boolean} whether or not all listeners got removed.
   */
  removeAllListeners(label) {
    return this.listeners.delete(label);
  }

  /**
   * Emits a new event. Calls all registered listeners.
   *
   * @access private
   *
   * @param {string} label event type
   * @param {...*} args any number of arguments for this event
   * @returns {boolean} whether or not a listener was called
   */
  emit(label, ...args) {
    const listeners = this.listeners.get(label);

    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }

  /**
   * Login event is emitted when a login succeeds with {@link Session#login}.
   *
   * @event Event#login
   * @type {string}
   */

  /**
   * Logout event is emitted either on a successful logout with {@link Session#logout} or an API
   * error with token related error codes.
   *
   * @event Event#logout
   * @type {undefined|Problem}
   */

  /**
   * Error events are emitted whenever an API responds with an {@link Error} or {@link Problem}.
   *
   * @event Event#error
   * @†ype {Error|Problem}
   */
}

/**
 * Global event emitter. All received errors will be emitted as an error event here.
 * You can access this emitter with {@link DataManager#events} or {@link Accounts#events}
 */
export default new EventEmitter();
