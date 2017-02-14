import cookie from 'browser-cookies';
import jwtDecode from 'jwt-decode';

/**
 * Map for storing all tokenStores.
 *
 * @type {Map<string, TokenStore>}
 */
export const stores = new Map();

/**
 * TokenStore class. Can store any given JWT token. Will save the token into a cookie when
 * document.cookie is defined.
 *
 * @access private
 * @class
 */
class TokenStore {
  /**
   * Creates a new {@link TokenStore} for the specified environment.
   *
   * @constructor
   * @param {environment} environment The environment for which to store tokens.
   */
  constructor(environment) {
    this.environment = environment;
    this.token = undefined;
    this.clientID = undefined;
  }

  /**
   * Set a new token.
   *
   * @param {string} token new token.
   */
  set(token) {
    if (!token) {
      throw new Error('Token cannot be undefined');
    }

    let decoded;

    try {
      decoded = jwtDecode(token);
    } catch (err) {
      throw new Error('Malformed token');
    }

    if (typeof document !== 'undefined') {
      cookie.set(`${this.environment}Token`, token, {
        secure: true,
        expires: new Date(decoded.exp * 1000),
      });
    }

    this.token = token;
  }

  /**
   * Get a previously saved token. Undefined on missing token.
   *
   * @returns {string|undefined} The token or undefined.
   */
  get() {
    if (!this.token && typeof document !== 'undefined') {
      this.token = cookie.get(`${this.environment}Token`);
    }

    return this.token;
  }

  /**
   * Check if a token is saved.
   *
   * @returns {boolean} Whether or not a token is saved.
   */
  has() {
    if (!this.token && typeof document !== 'undefined') {
      this.token = cookie.get(`${this.environment}Token`);
    }

    return !!this.token;
  }

  /**
   * Delete the saved token.
   *
   * @returns {undefined}
   */
  del() {
    if (typeof document !== 'undefined') {
      cookie.erase(`${this.environment}Token`);
    }

    this.token = undefined;
  }

  /**
   * Set clientID for this {@link TokenStore}.
   *
   * @param {string} clientID the clientID
   * @returns {undefined}
   */
  setClientID(clientID) {
    if (!clientID) {
      throw new Error('clientID cannot be undefined');
    }

    if (clientID !== 'rest') {
      throw new Error('clientID other than rest currently not supported');
    }

    this.clientID = clientID;
  }

  /**
   * Get the clientID for this {@link TokenStore}.
   *
   * @returns {string} the clientID
   */
  getClientID() {
    return this.clientID;
  }

  /**
   * Whether or not this {@link TokenStore} has a clientID set.
   *
   * @returns {boolean}
   */
  hasClientID() {
    return this.clientID !== undefined;
  }
}

/**
 * Factory function for creating a {@link TokenFactory} for an environment. Will return a
 * previously created {@link TokenStore}.
 *
 * @param {environment} environment the environment for which the token store should be created
 * @returns {TokenStore} The created token store
 */
export default function TokenStoreFactory(environment) {
  if (!stores.has(environment || 'live')) {
    stores.set(environment || 'live', new TokenStore(environment || 'live'));
  }
  return stores.get(environment || 'live');
}
