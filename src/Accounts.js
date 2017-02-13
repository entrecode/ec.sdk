import Core from './Core';
import {
  get,
  post,
  getUrl,
  getEmpty,
  postEmpty,
  superagentFormPost,
  optionsToQuery,
} from './helper';
import AccountList from './resources/AccountList';
import AccountResource from './resources/AccountResource';
import InvitesResource from './resources/InvitesResource';
import TokenStoreFactory from './TokenStore';

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
      if (options && Object.keys(options).length === 1 && 'accountID' in options) {
        throw new Error('Providing only an accountID in AccountList filter will result in single resource response. Please use Accounts#get');
      }

      const request = this.newRequest()
      .follow('ec:accounts/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AccountList(res, this.environment, traversal));
  }

  /**
   * Get a single {@link AccountResource} identified by accountID.
   *
   * @param {string} accountID id of the Account.
   * @returns {Promise<AccountResource>} resolves to the Account which should be loaded.
   */
  get(accountID) {
    return Promise.resolve()
    .then(() => {
      if (!accountID) {
        throw new Error('accountID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:accounts/options')
      .withTemplateParameters({ accountid: accountID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AccountResource(res, this.environment, traversal));
  }

  /**
   * Get the {@link AccountResource} which is currently logged in.
   *
   * @returns {Promise<AccountResource>} resolves to the Account which is logged in.
   */
  me() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:account')
      .withTemplateParameters();
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AccountResource(res, this.environment, traversal));
  }

  /**
   * Creates a new API token with 100 years validity.
   *
   * @returns {Promise<tokenResponse>} the created api
   *   token response.
   */
  createApiToken() {
    return post(this.environment, this.newRequest().follow('ec:auth/create-anonymous'), {})
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
    return Promise.resolve()
    .then(() => {
      if (this.tokenStore.has()) {
        throw new Error('already logged in or old token present. logout first');
      }

      if (!this.clientID) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }

      const request = this.newRequest().follow('ec:auth/login')
      .withTemplateParameters({ clientID: this.clientID });

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

      const request = this.newRequest().follow('ec:auth/logout')
      .withTemplateParameters({ clientID: this.clientID, token: this.token });

      return post(this.environment, request);
    })
    .then(() => {
      this.events.emit('logout');
      this.tokenStore.del();
      return Promise.resolve();
    });
  }

  /**
   * Will check if the given email is available for login.
   *
   * @param {string} email the email to check.
   * @returns {Promise<boolean>} Whether or not the email is available.
   */
  emailAvailable(email) {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }

      const request = this.newRequest().follow('ec:auth/email-available')
      .withTemplateParameters({ email });

      return get(this.environment, request)
    })
    .then(([a]) => a.available);
  }

  /**
   * Signup a new account.
   *
   *
   * @param {string} email email for the new account
   * @param {string} password password for the new account
   * @param {string?} invite optional invite. signup can be declined without invite.
   * @returns {Promise<string>} Promise resolving the newly created {@link AccountResource}
   */
  signup(email, password, invite) {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!password) {
        throw new Error('password must be defined');
      }
      if (!this.clientID) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }

      const request = this.newRequest().follow('ec:auth/register').withTemplateParameters({
        clientID: this.clientID,
        invite,
      });

      return getUrl(this.environment, request);
    })
    .then(url => superagentFormPost(url, { email, password }))
    .then((token) => {
      this.tokenStore.set(token.token);
      return Promise.resolve(token.token);
    });
  }

  /**
   * Start a password reset.
   *
   * @param {string} email email of the account
   * @returns {Promise} Promise resolving on success.
   */
  resetPassword(email) {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }
      if (!this.clientID) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }

      const request = this.newRequest().follow('ec:auth/password-reset').withTemplateParameters({
        clientID: this.clientID,
        email,
      });

      return getEmpty(this.environment, request);
    });
  }

  /**
   * Change the logged in account to the given new email address.
   *
   * @param {string} email the new email
   * @returns {Promise} Promise resolving on success.
   */
  changeEmail(email) {
    return Promise.resolve()
    .then(() => {
      if (!email) {
        throw new Error('email must be defined');
      }

      if (!this.tokenStore.has()) {
        throw new Error('not logged in.');
      }

      const request = this.newRequest().follow('ec:auth/change-email');

      return postEmpty(this.environment, request, { email });
    });
  }

  /**
   * Create new invites. Specify number of invites to create with count.
   *
   * @param {number} count the number of invites to create
   * @returns {Promise<InvitesResource>} Promise resolving to the invites resource
   */
  createInvites(count) {
    return Promise.resolve()
    .then(() => {
      if (count && typeof count !== 'number') {
        throw new Error('count must be a number');
      }

      const request = this.newRequest().follow('ec:invites');

      return post(this.environment, request, { count: count || 1 })
      .then(([invites, traversal]) => new InvitesResource(invites, this.environment, traversal));
    });
  }

  /**
   * Load the {@link InvitesResource}.
   *
   * @returns {Promise.<InvitesResource>} Promise resolving to the invites resource
   */
  invites() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:invites');

      return get(this.environment, request)
      .then(([invites, traversal]) => new InvitesResource(invites, this.environment, traversal));
    });
  }
}
