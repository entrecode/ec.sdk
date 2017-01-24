import Core, { get, optionsToQuery } from './Core';
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
}
