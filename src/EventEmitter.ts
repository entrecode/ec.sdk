import { environment } from "./Core";

/**
 * Login event is emitted when a login succeeds with {@link Session#login}. The newly created
 * accessToken is passed as event parameter.
 *
 * @event Event#login
 * @type {string}
 */

/**
 * Logout event is emitted either on a successful logout with {@link Session#logout} or an API
 * error with token related error codes. Will either have undefined or {@link Problem} as event
 * parameter.
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

/**
 * EventEmitter for emitting all received errors from any API.
 *
 * @class
 * @access private
 */
export class EventEmitter {
  protected listeners: Map<string, Array<(...args: any[]) => void>>;

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
  addListener(label: string, callback: () => void): void {
    if (!this.listeners.has(label)) {
      this.listeners.set(label, []);
    }
    this.listeners.get(label).push(callback);
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
  emit(label: string, ...args: Array<any>): boolean {
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
   * Adds a listener for an event type.
   *
   * @access private
   *
   * @param {string} label event type
   * @param {function} callback function to invoke when event occurs.
   * @returns {undefined}
   */
  on(label: string, callback: () => void): void {
    this.addListener(label, callback);
  }

  /**
   * Removes all listeners for a given label.
   *
   * @access private
   *
   * @param {string} label event type.
   * @returns {boolean} whether or not all listeners got removed.
   */
  removeAllListeners(label: string): boolean {
    return this.listeners.delete(label);
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
  removeListener(label: string, callback: () => void): boolean {
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
}

/**
 * Global event emitter. All received errors will be emitted as an error event here.
 * You can access this emitter with {@link Core#on}.
 *
 * @access private
 */
const emitterMap = new Map();

/**
 * Create or get an event Emitter for a specific environment.
 *
 * @access private
 *
 * @param {string} environment environment string to create emitter for
 * @returns {EventEmitter} EventEmitter bound to the specific environment
 */
export function EventEmitterFactory(environment: environment = 'live') {
  if (!emitterMap.has(environment)) {
    emitterMap.set(environment, new EventEmitter());
  }

  return emitterMap.get(environment);
}
