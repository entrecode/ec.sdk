import Core from './Core';
import {
  get,
  post,
  getUrl,
  getEmpty,
  postEmpty,
  superagentFormPost,
  optionsToQuery
} from './helper';
import AccountList from './resources/AccountList';
import AccountResource from './resources/AccountResource';
import ClientList from './resources/ClientList';
import ClientResource from './resources/ClientResource';
import InvalidPermissionsResource from './resources/InvalidPermissionsResource';
import InvitesResource from './resources/InvitesResource';
import GroupList from './resources/GroupList';
import GroupResource from './resources/GroupResource';
import TokenStoreFactory from './TokenStore';

const urls = {
  live: 'https://accounts.entrecode.de/',
  stage: 'https://accounts.cachena.entrecode.de/',
  nightly: 'https://accounts.buffalo.entrecode.de/',
  develop: 'http://localhost:7472/',
};

/**
 * API connector for {@link https://doc.entrecode.de/en/latest/account_server/ Accounts API}. Use
 * this for ec.accounts only. It contains APIs for profile editing (change email, reset password,
 * signup…), permissions, clients, and groups.
 *
 * @class
 */
export default class Accounts extends Core {
  /**
   * Creates a new instance of {@link Accounts} API connector.
   *
   * @param {?environment} environment the {@link environment} to connect to.
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
   * Set the clientID to use with the Accounts API. Currently only `rest` is supported.
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
   * Load a {@link AccountList} of {@link AccountResource} filtered by the values specified
   * by the options parameter.
   *
   * @example
   * return accounts.list({
   *   filter: {
   *     created: {
   *       from: new Date(new Date.getTime() - 600000).toISOString()),
   *     },
   *   },
   * })
   * .then((list) => {
   *   return show(list);
   * })
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<AccountList>} resolves to account list with applied filters.
   */
  accountList(options) {
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
   * @example
   * return accounts.get(this.accountList.getItem(index).accountID)
   * .then((account) => {
   *   return show(account.email);
   * });
   *
   * @param {string} accountID id of the Account.
   * @returns {Promise<AccountResource>} resolves to the Account which should be loaded.
   */
  account(accountID) {
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
   * @example
   * return accounts.me()
   * .then((account) => {
   *   return show(`Your are logged in as ${account.name || account.email}`);
   * });
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
   * Load the {@link GroupList}
   *
   * @example
   * return accounts.groupList({
   *   filter: {
   *     title: {
   *       search: 'dev',
   *     },
   *   },
   * })
   * .then(groups => {
   *   // all groups with 'dev' in the title
   *   return Promise.all(groups.getAllItems.forEach(group => show(group)));
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<GroupList>} Promise resolving goup list
   */
  groupList(options) {
    return Promise.resolve()
    .then(() => {
      if (options && Object.keys(options).length === 1 && 'groupID' in options) {
        throw new Error('Providing only an groupID in GroupList filter will result in single resource response. Please use Accounts#groupList');
      }

      const request = this.newRequest()
      .follow('ec:acc/groups/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new GroupList(res, this.environment, traversal));
  }

  /**
   * Load a single group
   *
   * @example
   * return accounts.group(groupID)
   * .then((group) => {
   *   group.addPermission('can-view-stacktrace');
   *   return group.save();
   * });
   *
   * @param {string} groupID the id of the group
   * @returns {Promise<GroupResource>} Promise resolving to the group
   */
  group(groupID) {
    return Promise.resolve()
    .then(() => {
      if (!groupID) {
        throw new Error('groupID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:acc/clients/options')
      .withTemplateParameters({ groupid: groupID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new GroupResource(res, this.environment, traversal));
  }

  /**
   * Load the {@link ClientList}.
   *
   * @example
   * return accounts.clientList()
   * .then(clients => {
   *   return clients.getAllItems().filter(client => client.clientID === 'thisOne');
   * })
   * .then(clientArray => {
   *   return show(clientArray[0]);
   * });
   *
   * // This would actually be better:
   * return accounts.clientList({
   *   filter: {
   *     clientID: 'thisOne',
   *   },
   * })
   * .then(clients => {
   *   return show(clients.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<ClientList>} Promise resolving to ClientList
   */
  clientList(options) {
    return Promise.resolve()
    .then(() => {
      if (options && Object.keys(options).length === 1 && 'clientID' in options) {
        throw new Error('Providing only an clientID in ClientList filter will result in single resource response. Please use Accounts#client');
      }

      const request = this.newRequest()
      .follow('ec:acc/clients/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new ClientList(res, this.environment, traversal));
  }

  /**
   * Load a single {@link ClientResource}.
   *
   * @example
   * return accounts.client('thisOne')
   * .then(client => {
   *   return show(client);
   * });
   *
   * @param {string} clientID the clientID
   * @returns {Promise<ClientResource>} Promise resolving to ClientResource
   */
  client(clientID) {
    return Promise.resolve()
    .then(() => {
      if (!clientID) {
        throw new Error('clientID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:acc/clients/options')
      .withTemplateParameters({ clientid: clientID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new ClientResource(res, this.environment, traversal));
  }

  /**
   * Creates a new API token with 100 years validity.
   *
   * @example
   * return accounts.createAPIToken()
   * .then((token) => {
   *   return apiTokenCreated(token);
   * });
   *
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token response.
   */
  createApiToken() {
    return post(this.environment, this.newRequest().follow('ec:auth/create-anonymous'), {})
    .then(([tokenResponse]) => tokenResponse);
  }

  /**
   * Load the {@link InvitesResource} with unused invites.
   *
   * @example
   * return accounts.invites()
   * .then((invites) => {
   *   if (invites.invites.length < 5){
   *     return Promise.resolve(invites.invites);
   *   }
   *   return accounts.createInvites(5 - invites.invites.length);
   * })
   * .then((invites) => {
   *   return Promise.all(invites.invites.forEach((invite, index) => sendInvite(invite,
   *   emails[index]);
   * })
   * .then(() => console.log('Invites send.');
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

  /**
   * Create new invites. Specify number of invites to create with count.
   *
   * @example
   * return accounts.createInvites(5)
   * .then((invites) => {
   *   return Promise.all(invites.invites.forEach((invite, index) => sendInvite(invite,
   *   emails[index]);
   * })
   * .then(() => console.log('Invites send.');
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
   * Get {@link InvalidPermissionsResource} to show all invalid permissions.
   *
   * @example
   * return accounts.invalidPermissions()
   * .then((invalidPermissions) => {
   *   show(invalidPermissions.invalidAccountPermissions);
   *   show(invalidPermissions.invalidGroupPermissions);
   * });
   *
   * @returns {Promise<InvalidPermissionsResource>} Promise resolving to invalid permissions
   */
  invalidPermissions() {
    const request = this.newRequest()
    .follow('ec:invalid-permissions');

    return get(this.environment, request)
    .then(([resource, traversal]) =>
      new InvalidPermissionsResource(resource, this.environment, traversal));
  }

  /**
   * Will check if the given email is available for login.
   *
   * @example
   * return accounts.emailAvailable(email)
   * .then((available) => {
   *    if (available){
   *      return accounts.signup(email, password);
   *    } else {
   *      return showError(new Error(`Email ${email} already registered.`));
   *    }
   * });
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
   * Signup a new account. Invite may be required.
   *
   * @example
   * return accounts.signup(email, password, invite)
   * .then((token) => {
   *   accounts.setToken(token);
   *   return show('Successfully registered account');
   * });
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
      if (!this.tokenStore.hasClientID()) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }

      const request = this.newRequest().follow('ec:auth/register').withTemplateParameters({
        clientID: this.tokenStore.getClientID(),
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
   * @example
   * return accounts.resetPassword(email)
   * .then(() => show(`Password reset link send to ${email}`))
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
      if (!this.tokenStore.hasClientID()) {
        throw new Error('clientID must be set with Account#setClientID(clientID: string)');
      }

      const request = this.newRequest().follow('ec:auth/password-reset').withTemplateParameters({
        clientID: this.tokenStore.getClientID(),
        email,
      });

      return getEmpty(this.environment, request);
    });
  }

  /**
   * Change the logged in account to the given new email address.
   *
   * @example
   * return accounts.resetPassword(email)
   * .then(() => show(`Email change startet. Please verify with your new address`))
   *
   * @param {string} email the new email
   * @returns {Promise<undefined>} Promise resolving on success.
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
}
