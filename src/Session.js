import Core from './Core';
import { post } from './helper';
import TokenStoreFactory from './TokenStore';

const urls = {
  live: 'https://accounts.entrecode.de/',
  stage: 'https://accounts.cachena.entrecode.de/',
  nightly: 'https://accounts.buffalo.entrecode.de/',
  develop: 'http://localhost:7472/',
};

/**
 * Module for logging in and logging out.
 *
 * @class
 * @module
 */
export default class Session extends Core {
  /**
   * Creates a new instance of {@link Session} module. Can be used to log in and log out.
   *
   * @param {?string} environment the environment to connect to. 'live', 'stage', 'nightly', or
   *   'develop'.
   */
  constructor(environment) {
    if (environment && !{}.hasOwnProperty.call(urls, environment)) {
      throw new Error('invalid environment specified');
    }

    super(urls[environment || 'live']);
    this.environment = environment || 'live';
    this.tokenStore = TokenStoreFactory(environment || 'live');
  }

  /**
   * Set the clientID to use with the Accounts API. Currently only 'rest' is supported.
   *
   * @param {string} clientID the clientID.
   * @returns {Accounts} this object for chainability
   */
  setClientID(clientID) {
    if (!clientID) {
      throw new Error('ClientID must be defined');
    }

    if (clientID !== 'rest') {
      throw new Error('ec.sdk currently only supports client \'rest\'');
    }

    this.tokenStore.setClientID(clientID);
    return this;
  }

  /**
   * Response when creating a API token in account server.
   *
   * @typedef {{jwt: string, accountID: string, iat: number, exp: number}} tokenResponse
   */

  /**
   * Login with email and password. Currently only supports rest clientID with body post of
   * credentials.
   *
   * @param {string} email email address of the user
   * @param {string} password password of the user
   * @returns {Promise<string>} Promise resolving to the issued token
   */
  login(email, password) {
    return Promise.resolve()
    .then(() => {
      if (this.tokenStore.has()) {
        throw new Error('already logged in or old token present. logout first');
      }

      if (!this.tokenStore.hasClientID()) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }

      const request = this.newRequest().follow('ec:auth/login')
      .withTemplateParameters({ clientID: this.tokenStore.getClientID() });

      return post(this.environment, request, { email, password });
    })
    .then(([token]) => {
      this.tokenStore.set(token.token);
      this.events.emit('login', token.token);

      return token.token;
    });
  }

  /**
   * Logout with existing token. Will invalidate the token with the Account API and remove any
   * cookie stored.
   *
   * @returns {Promise<undefined>} Promise resolving undefined on success.
   */
  logout() {
    return Promise.resolve()
    .then(() => {
      if (!this.tokenStore.has()) {
        return Promise.resolve();
      }

      if (!this.tokenStore.hasClientID()) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }

      const request = this.newRequest().follow('ec:auth/logout')
      .withTemplateParameters({ clientID: this.tokenStore.getClientID(), token: this.token });

      return post(this.environment, request);
    })
    .then(() => {
      this.events.emit('logout');
      this.tokenStore.del();
      return Promise.resolve();
    });
  }
}
