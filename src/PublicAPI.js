import halfred from 'halfred';

import { get } from './helper';
import { urls } from './DataManager';
import TokenStoreFactory from './TokenStore';
import Core from './Core';

/**
 * API connector for public APIs.
 */
export default class PublicAPI extends Core {
  /**
   * Creates a new instance of {@link PublicAPI} API connector.
   *
   * @param {string} id shortID of the desired DataManager.
   * @param {environment?} environment the environment to connect to.
   */
  constructor(id, environment) {
    if (environment && !(environment in urls)) {
      throw new Error('invalid environment specified');
    }
    if (!id || !/[a-f0-9]{8}/i.test(id)) {
      throw new Error('must provide valid shortID');
    }

    super(`${urls[environment || 'live']}api/${id}`);
    this.environment = environment || 'live';
    this.tokenStore = TokenStoreFactory(environment || 'live');
    this.shortID = id;

    this.resource = null;

    ['dataManagerID', 'title', 'description', 'locales',
      'defaultLocale', 'models', 'account', 'config']
    .forEach((property) => {
      Object.defineProperty(this, property, {
        enumerable: true,
        get: () => this.resource[property],
      });
    });
  }

  /**
   * Resolves the root response of ths PublicAPI DataManager
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<PublicAPI>} returns this
   */
  resolve(reload) {
    if (!reload && this.resource) {
      return Promise.resolve(this);
    }

    return get(this.environment, this.newRequest())
    .then(([res, traversal]) => {
      this.resource = halfred.parse(res);
      this.traversal = traversal;

      return this;
    });
  }

  /**
   * Load the list of models. Will resolve to a object with modelTitle as key and {@link Model} as
   * value.
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<any>} Object with models
   */
  modelList(reload) {
    return this.resolve(reload)
    .then(() => {
      const out = {};
      this.models.forEach((model) => {
        // TODO proper model object
        out[model.title] = model;
      });
      this.modelCache = out;
      return out;
    });
  }

  /**
   * Set the clientID to use with the public API. Currently only `rest` is supported.
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
   * Login with email and password. Currently only supports `rest` clientID with body post of
   * credentials and tokenMethod `body`.
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
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }

      return this.follow(`${this.shortID}:_auth/login`);
    })
    .then((request) => {
      request.withTemplateParameters({ clientID: this.tokenStore.getClientID() });
      return post(this.environment, request, { email, password });
    })
    .then(([token]) => {
      this.tokenStore.set(token.token);
      this.events.emit('login', token.token);

      return token.token;
    });
  }

  /**
   * Logout with existing token. Will invalidate the token with the public API and remove any
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
        throw new Error('clientID must be set with PublicAPI#setClientID(clientID: string)');
      }

      return this.follow(`${this.shortID}:_auth/logout`)
      .then((request) => {
        request.withTemplateParameters({
          clientID: this.tokenStore.getClientID(),
          token: this.token,
        });
        return post(this.environment, request);
      });
    })
    .then(() => {
      this.events.emit('logout');
      this.tokenStore.del();
      return Promise.resolve();
    });
  }
}
