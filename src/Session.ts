import Core, { environment } from './Core';
import { get, post } from './helper';
import AccountResource from './resources/accounts/AccountResource';

const tokenStoreSymbol = Symbol.for('tokenStore');
const eventsSymbol = Symbol.for('events');
const environmentSymbol = Symbol.for('environment');
const meLoadedTimeSymbol = Symbol.for('meLoadedTime');
const meSymbol = Symbol('_me');

const urls = {
  live: 'https://accounts.entrecode.de/',
  stage: 'https://accounts.cachena.entrecode.de/',
  nightly: 'https://accounts.buffalo.entrecode.de/',
  develop: 'http://localhost:7472/',
};

/**
 * This API connector can be used for login or logout into ec.apis. Login state will be avaliable
 * to all other API connectors of the same {@link environment}.
 *
 * @example
 * return session.login(email, password)
 * .then(() => {
 *   const accounts = new Accounts();
 *   return accounts.me();
 * });
 *
 * @class
 */
export default class Session extends Core {
  /**
   * Creates a new instance of {@link Session} API connector.
   *
   * @param {environment?} environment the environment to connect to.
   */
  constructor(environment?: environment) {
    super(urls, environment);
  }

  /**
   * Set the clientID to use with the Accounts API. Currently only `rest` is supported.
   *
   * @param {string} clientID the clientID.
   * @returns {Session} this object for chainability
   */
  setClientID(clientID: string): Session {
    if (!clientID) {
      throw new Error('ClientID must be defined');
    }

    this[tokenStoreSymbol].setClientID(clientID);
    return this;
  }

  /**
   * Login with email and password. Currently only supports `rest` clientID with body post of
   * credentials and tokenMethod `body`.
   *
   * @param {string} email email address of the user
   * @param {string} password password of the user
   * @returns {Promise<string>} Promise resolving to the issued token
   */
  login(email: string, password: string): Promise<string> {
    return Promise.resolve()
    .then(() => {
      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with Session#setClientID(clientID: string)');
      }
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }

      return this.follow('ec:auth/login');
    })
    .then((request) => {
      request.withTemplateParameters({ clientID: this[tokenStoreSymbol].getClientID() });
      return post(this[environmentSymbol], request, { email, password });
    })
    .then(([token]) => {
      this[tokenStoreSymbol].setToken(token.token);
      this[eventsSymbol].emit('login', token.token);

      return token.token;
    });
  }

  /**
   * Logout with existing token. Will invalidate the token with the Account API and remove any
   * cookie stored.
   *
   * @returns {Promise<void>} Promise resolving undefined on success.
   */
  logout(): Promise<void> {
    return Promise.resolve()
    .then(() => {
      if (!this[tokenStoreSymbol].hasToken()) {
        return Promise.resolve();
      }

      if (!this[tokenStoreSymbol].hasClientID()) {
        throw new Error('clientID must be set with Session#setClientID(clientID: string)');
      }

      return this.follow('ec:auth/logout')
      .then((request) => {
        request.withTemplateParameters({
          clientID: this[tokenStoreSymbol].getClientID(),
          token: this[tokenStoreSymbol].getToken(),
        });
        return post(this[environmentSymbol], request);
      });
    })
    .then(() => {
      this[eventsSymbol].emit('logout');
      this[tokenStoreSymbol].deleteToken();
      return Promise.resolve();
    });
  }

  /**
   * Checks a permission for the currently logged in user
   *
   * @param {string} permission the permission to check.
   * @returns {Promise<boolean>} true if user has permission, false otherwise.
   */
  checkPermission(permission: string): Promise<boolean> {
    return Promise.resolve()
    .then(() => {
      if (!permission) {
        throw new Error('permission must be defined');
      }

      if (this[meSymbol] && new Date().getTime() - this[meLoadedTimeSymbol] <= 300000) { // 5 Minutes
        return undefined;
      }

      return this.follow('ec:account')
      .then(request => get(this[environmentSymbol], request))
      .then(([res, traversal]) => {
        this[meSymbol] = new AccountResource(res, this[environmentSymbol], traversal)
        this[meLoadedTimeSymbol] = new Date();
        return undefined;
      });
    })
    .then(() => this[meSymbol].checkPermission(permission));
  }
}
