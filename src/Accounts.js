import Core, { get, post, optionsToQuery } from './Core';
import AccountList from './resources/AccountList';
import AccountResource from './resources/AccountResource';

const urls = {
  live: 'https://accounts.entrecode.de/',
  stage: 'https://accounts.cachena.entrecode.de/',
  nightly: 'https://accounts.buffalo.entrecode.de/',
  develop: 'http://localhost:7472/',
};

/**
 * Module for working with Accounts API.
 *
 * @class
 * @module
 */
export default class Accounts extends Core {
  /**
   * Creates a new instance of {@link Accounts} module. Can be used to work with Accounts
   * API.
   *
   * @param {?string} environment the environment to connect to. 'live', 'stage', 'nightly', or
   *   'develop'.
   */
  constructor(environment) {
    if (environment && !{}.hasOwnProperty.call(urls, environment)) {
      throw new Error('invalid environment specified');
    }

    super(urls[environment || 'live']);
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

    this.clientID = clientID;
    return this;
  }

  /**
   * Load a {@link AccountList} of {@link AccountResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {{size: number, page: number, sort: array<string>, filter: filter}} options the
   *   filter options.
   * @returns {Promise<AccountList>} resolves to account list with applied filters.
   */
  list(options) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:accounts/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(request);
    })
    .then(([res, traversal]) => new AccountList(res, traversal));
  }

  /**
   * Get a single {@link AccountResource} identified by accountID.
   *
   * @param {string} accountID id of the Account.
   * @returns {Promise<AccountResource>} resolves to the Account which should be loaded.
   */
  get(accountID) {
    if (!accountID) {
      throw new Error('accountID must be defined');
    }
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:account/by-id')
      .withTemplateParameters({ accountID });
      return get(request);
    })
    .then(([res, traversal]) => new AccountResource(res, traversal));
  }

  /**
   * Creates a new API token with 100 years validity.
   *
   * @returns {Promise<tokenResponse>} the created api
   *   token response.
   */
  createApiToken() {
    return post(this.newRequest().follow('ec:auth/create-anonymous'), {})
    .then(([tokenResponse]) => tokenResponse);
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
    if (!this.clientID) {
      throw new Error('clientID must be set with Account#setClientID(clientID: string)');
    }
    if (!email) {
      throw new Error('email must be defined');
    }
    if (!password) {
      throw new Error('password must be defined');
    }

    return post(this.newRequest().follow('ec:auth/login'), { email, password })
    .then(([token]) => token.token);
  }
}
