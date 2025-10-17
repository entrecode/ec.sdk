import * as cookie from 'browser-cookies'; // js-cookie
import * as jwtDecode from 'jwt-decode';
import { environment } from './Core';

/**
 * Map for storing all tokenStores.
 *
 * @access private
 *
 * @type {Map<string, TokenStore>}
 */
export const stores: Map<string, TokenStore> = new Map();

/**
 * TokenStore class. Can store any given JWT token. Will save the token into a cookie when
 * document.cookie is defined.
 *
 * @access private
 * @class
 */
export class TokenStore {
  protected agent: string | undefined;
  protected clientID: string | undefined;
  protected environment: string;
  protected token: string | undefined;
  protected refreshToken: string | undefined;

  /**
   * Creates a new {@link TokenStore} for the specified environment.
   *
   * @constructor
   * @param {environment} environment The environment for which to store tokens.
   */
  constructor(environment: environment | string = 'live') {
    this.environment = environment;
    this.token = undefined;
    this.refreshToken = undefined;
    this.clientID = undefined;
    this.agent = undefined;
  }

  /**
   * Delete the saved token.
   *
   * @returns {undefined}
   */
  deleteToken(): void {
    if (typeof document !== 'undefined') {
      cookie['erase'](`${this.environment}Token`);
    }

    this.token = undefined;
  }

  /**
   * Delete the saved token.
   *
   * @returns {undefined}
   */
  deleteRefreshToken(): void {
    if (typeof document !== 'undefined') {
      cookie['erase'](`${this.environment}RefreshToken`);
    }

    this.refreshToken = undefined;
  }

  /**
   * Get the clientID for this {@link TokenStore}.
   *
   * @returns {string} the clientID
   */
  getClientID(): string {
    return this.clientID as string;
  }

  /**
   * Get a previously saved token. Undefined on missing token.
   *
   * @returns {string} The token or undefined.
   */
  getToken(): string {
    if (!this.token && typeof document !== 'undefined') {
      this.token = cookie.get(`${this.environment}Token`) as string;
    }

    return this.token as string;
  }

  /**
   * Get a previously saved refresh token. Undefined on missing token.
   *
   * @returns {string} The token or undefined.
   */
  getRefreshToken(): string {
    if (!this.refreshToken && typeof document !== 'undefined') {
      this.refreshToken = cookie.get(`${this.environment}RefreshToken`) as string;
    }

    return this.refreshToken as string;
  }

  /**
   * Get the user agent for this {@link TokenStore}.
   *
   * @returns {string} the user agent
   */
  getUserAgent(): string {
    return this.agent as string;
  }

  /**
   * Whether or not this {@link TokenStore} has a clientID set.
   *
   * @returns {boolean} Whether or not a clientID is set.
   */
  hasClientID(): boolean {
    return this.clientID !== undefined;
  }

  /**
   * Check if a token is saved.
   *
   * @returns {boolean} Whether or not a token is saved.
   */
  hasToken(): boolean {
    if (!this.token && typeof document !== 'undefined') {
      this.token = cookie.get(`${this.environment}Token`) as string;
    }

    return !!this.token;
  }

  /**
   * Check if a refresh token is saved.
   *
   * @returns {boolean} Whether or not a token is saved.
   */
  hasRefreshToken(): boolean {
    if (!this.refreshToken && typeof document !== 'undefined') {
      this.refreshToken = cookie.get(`${this.environment}RefreshToken`) as string;
    }

    return !!this.refreshToken;
  }

  /**
   * Whether or not this {@link TokenStore} has a user agent set.
   *
   * @returns {boolean} Whether or not a user agent is set.
   */
  hasUserAgent(): boolean {
    return this.agent !== undefined;
  }

  /**
   * Set clientID for this {@link TokenStore}.
   *
   * @param {string} clientID the clientID
   */
  setClientID(clientID: string): void {
    if (!clientID) {
      throw new Error('clientID cannot be undefined');
    }

    this.clientID = clientID;
  }

  /**
   * Set a new token.
   *
   * @param {string} token new token.
   */
  setToken(token: string): void {
    if (!token) {
      throw new Error('Token cannot be undefined');
    }

    let decoded: any;

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
      if (!cookie.get(`${this.environment}Token`)) {
        console.warn('ec.sdk: cookie not set. are you on a http site?');
      }
    }

    this.token = token;
  }

  /**
   * Set a new refresh token.
   *
   * @param {string} token new token.
   */
  setRefreshToken(token: string): void {
    if (!token) {
      throw new Error('Token cannot be undefined');
    }

    let decoded: any;

    try {
      decoded = jwtDecode(token);
    } catch (err) {
      throw new Error('Malformed token');
    }

    if (typeof document !== 'undefined') {
      cookie.set(`${this.environment}RefreshToken`, token, {
        secure: true,
        expires: new Date(decoded.exp * 1000),
      });
      if (!cookie.get(`${this.environment}RefreshToken`)) {
        console.warn('ec.sdk: cookie not set. are you on a http site?');
      }
    }

    this.refreshToken = token;
  }

  /**
   * Set user agent for this {@link TokenStore}. The value must match the following regex:
   * ^(?:[\w- ]+\/[\w\.+-]+(?: \([\w,;:\.\+/ ]+\))? ?)+
   *
   * @param {string} agent the user agent
   * @returns {undefined}
   */
  setUserAgent(agent: string): void {
    if (!agent) {
      throw new Error('agent cannot be undefined');
    }

    if (!/^(?:[\w- ]+\/[\w.+-]+(?: \([\w,;:.+/ ]+\))? ?)+/.test(agent)) {
      throw new Error('agent is malformed');
    }

    this.agent = agent;
  }
}

/**
 * Factory function for creating a {@link TokenStore} for an environment. Will return a
 * previously created {@link TokenStore}.
 *
 * @access private
 *
 * @param {environment} environment the environment for which the token store should be created
 * @returns {TokenStore} The created token store
 */
export default function TokenStoreFactory(environment: environment | string = 'live'): TokenStore {
  if (!stores.has(environment)) {
    stores.set(environment, new TokenStore(environment));
  }
  return stores.get(environment) as TokenStore;
}
