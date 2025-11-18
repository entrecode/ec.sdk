import Core from './Core';
import { environment, options } from './types';
import { get, post } from './helper';
import AccountResource from './resources/accounts/AccountResource';

const tokenStoreSymbol: any = Symbol.for('tokenStore');
const eventsSymbol: any = Symbol.for('events');
const environmentSymbol: any = Symbol.for('environment');
const meLoadedTimeSymbol: any = Symbol.for('meLoadedTime');
const meSymbol: any = Symbol('_me');
const requestCacheSymbol: any = Symbol('requestCache');

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
 * @class
 *
 * @example
 * const session = new Session();
 * return session.login(email, password)
 * .then(() => {
 *   const accounts = new Accounts();
 *   return accounts.me();
 * });
 *
 *
 * @param {environment?} environment the environment to connect to
 */
export default class Session extends Core {
  constructor(envOrOptions?: environment | options) {
    super(urls, envOrOptions);
    this[requestCacheSymbol] = undefined;
  }

  /**
   * Checks if the currently logged in user has a given permission.
   *
   * @param {string} permission the permission to check
   * @returns {Promise<boolean>} true if user has permission, false otherwise
   */
  checkPermission(permission: string): Promise<boolean> {
    return Promise.resolve()
      .then(() => {
        if (!permission) {
          throw new Error('permission must be defined');
        }

        if (this[meSymbol] && new Date().getTime() - this[meLoadedTimeSymbol] <= 300000) {
          // 5 Minutes
          return undefined;
        }

        if (!this[requestCacheSymbol]) {
          this[requestCacheSymbol] = this.follow('ec:account')
            .then((request) => get(this[environmentSymbol], request))
            .then(([res, traversal]) => {
              this[requestCacheSymbol] = undefined;
              this[meSymbol] = new AccountResource(res, this[environmentSymbol], traversal);
              this[meLoadedTimeSymbol] = new Date();
              return undefined;
            });
        }

        return this[requestCacheSymbol];
      })
      .then(() => this[meSymbol].checkPermission(permission));
  }

  /**
   * Queries the current users permission trie for granted permissions. See [shiro-trie](https://www.npmjs.com/package/shiro-trie).
   *
   * @param {string} query the permission string to be queried
   * @returns {Promise<Array<string>} an array of available permissions
   */
  async permissions(query: string): Promise<Array<String>> {
    if (!query) {
      throw new Error('query must be defined');
    }

    if (!this[meSymbol] || new Date().getTime() - this[meLoadedTimeSymbol] > 300000) {
      if (!this[requestCacheSymbol]) {
        this[requestCacheSymbol] = this.follow('ec:account')
          .then((request) => get(this[environmentSymbol], request))
          .then(([res, traversal]) => {
            this[requestCacheSymbol] = undefined;
            this[meSymbol] = new AccountResource(res, this[environmentSymbol], traversal);
            this[meLoadedTimeSymbol] = new Date();
            return undefined;
          });
      }
      await this[requestCacheSymbol];
    }

    return this[meSymbol].queryPermissions(query);
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
   * @returns {Promise<undefined>} Promise resolving undefined on success.
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

        return this.follow('ec:auth/logout').then((request) => {
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
}
