import AccountList from './resources/accounts/AccountList';
import AccountResource from './resources/accounts/AccountResource';
import ClientList from './resources/accounts/ClientList';
import ClientResource from './resources/accounts/ClientResource';
import Core, { environment, options } from './Core';
import InvalidPermissionsResource from './resources/accounts/InvalidPermissionsResource';
import InviteResource from './resources/accounts/InviteResource';
import InviteList from './resources/accounts/InviteList';
import GroupList from './resources/accounts/GroupList';
import GroupResource from './resources/accounts/GroupResource';
import { filterOptions, filter } from './resources/ListResource';
import { get, getEmpty, post, postEmpty } from './helper';

const tokenStoreSymbol: any = Symbol.for('tokenStore');
const environmentSymbol: any = Symbol.for('environment');
const relationsSymbol: any = Symbol.for('relations');

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
 *
 * @example
 * const accounts = new Accounts();
 * return accounts.me()
 * .then((me) => {
 *   return me.checkPemission('dm-create');
 * })
 * .then((allowed) => {
 *   if(!allowed){
 *     return showError();
 *   }
 *
 *   return createDM(…);
 * };
 *
 * @param {environment?} environment the {@link environment} to connect to
 */
export default class Accounts extends Core {
  constructor(envOrOptions?: environment | options) {
    super(urls, envOrOptions);

    this[relationsSymbol] = {
      account: {
        relation: 'ec:accounts/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accountid',
        ResourceClass: AccountResource,
        ListClass: AccountList,
      },
      invite: {
        relation: 'ec:invites/options',
        createRelation: 'ec:invites',
        createTemplateModifier: '-template-post',
        id: 'invite',
        ResourceClass: InviteResource,
        ListClass: InviteList,
      },
      client: {
        relation: 'ec:acc/clients/options',
        createRelation: 'ec:acc/client/by-id',
        createTemplateModifier: '',
        id: 'clientid',
        ResourceClass: ClientResource,
        ListClass: ClientList,
      },
      group: {
        relation: 'ec:acc/groups/options',
        createRelation: 'ec:acc/group/by-id',
        createTemplateModifier: '-template',
        id: 'groupid',
        ResourceClass: GroupResource,
        ListClass: GroupList,
      }
    };
  }

  /**
   * Get a single {@link AccountResource} identified by accountID.
   *
   * @example
   * return accounts.account(accountList.getFirstItem().accountID)
   * .then(account => show(account.email));
   *
   * @param {string} accountID id of the Account
   * @returns {Promise<AccountResource>} resolves to the Account which should be loaded
   */
  account(accountID: string): Promise<AccountResource> {
    return <Promise<AccountResource>>this.resource('account', accountID);
  }

  /**
   * Load a {@link AccountList} of {@link AccountResource}s filtered by the values specified
   * by the options parameter.
   *
   * @example
   * return accounts.accountList({
   *   filter: {
   *     created: {
   *       from: new Date(new Date.getTime() - 600000).toISOString()),
   *     },
   *   },
   * })
   * .then(list => show(list))
   *
   * @param {filterOptions?} options the filter options
   * @returns {Promise<AccountList>} resolves to account list with applied filters
   */
  accountList(options?: filterOptions | any): Promise<AccountList> {
    return <Promise<AccountList>>this.resourceList('account', options);
  }

  /**
   * Change the logged in account to the given new email address.
   *
   * @example
   * return accounts.changeEmail(newEmail)
   * .then(() => show(`Email change started. Please verify with your new address.`))
   *
   * @param {string} email the new email
   * @returns {Promise<undefined>} Promise resolving on success.
   */
  changeEmail(email: string): Promise<void> {
    return Promise.resolve()
      .then(() => {
        if (!email) {
          throw new Error('email must be defined');
        }

        if (!this[tokenStoreSymbol].hasToken()) {
          throw new Error('not logged in.');
        }

        return this.follow('ec:auth/change-email');
      })
      .then(request => postEmpty(this[environmentSymbol], request, { email }));
  }

  /**
   * Load a single {@link ClientResource}.
   *
   * @example
   * return accounts.client('thisOne')
   * .then(client => show(client));
   *
   * @param {string} clientID the clientID
   * @returns {Promise<ClientResource>} Promise resolving to ClientResource
   */
  client(clientID: string): Promise<ClientResource> {
    return <Promise<ClientResource>>this.resource('client', clientID);
  }

  /**
   * Load the {@link ClientList} filtered by the values specified by the options parameter.
   *
   * @example
   * return accounts.clientList({
   *   filter: {
   *     callbackURL: 'thisOne', // the same as 'callbackURL: { exact: 'thisOne' }'
   *   },
   * })
   * .then(clients => show(clients.getFirstItem()));
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<ClientList>} Promise resolving to ClientList
   */
  clientList(options?: filterOptions | any): Promise<ClientList> {
    return <Promise<ClientList>>this.resourceList('client', options);
  }

  /**
   * Creates a new API token with 100 years validity.
   *
   * @example
   * return accounts.createAPIToken()
   * .then(token => show(token));
   *
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token response.
   */
  createApiToken(): Promise<tokenResponse> { // TODO advanced type
    return this.follow('ec:auth/create-anonymous')
      .then(request => post(this[environmentSymbol], request, {}))
      .then(([tokenResponse]) => tokenResponse);
  }

  /**
   * Create a new Client.
   *
   * @param {object} client object representing the client
   * @returns {Promise<ClientResource>} the newly created ClientResource
   */
  createClient(client: any): Promise<ClientResource> {
    return <Promise<ClientResource>>this.create('client', client);
  }

  /**
   * Create a new Group.
   *
   * @param {object} group object representing the group
   * @returns {Promise<GroupResource>} the newly created GroupResource
   */
  createGroup(group: any): Promise<GroupResource> {
    return <Promise<GroupResource>>this.create('group', group);
  }

  /**
   * Create new invites. Specify number of invites to create with `options.count`, permissions with `options.permissions` or `options.groups[]`.
   *
   * @param {{count: number, pesmissions: Array<string>, groups: Array<{groupID: string, name: string}>}} options object describing the invites to create
   * @returns {Promise<InviteList>} Promise resolving to the InviteList
   */
  createInvites(options: inviteCreateObject = { count: 1 }): Promise<InviteList> {
    return <Promise<InviteList>>this.create('invite', options, true);
  }

  /**
   * Will check if the given email is available for login.
   *
   * @example
   * return accounts.emailAvailable(email)
   * .then((available) => {
   *    if (!available){
   *      return showError(new Error(`Email ${email} not available.`));
   *    }
   *
   *    return accounts.signup(email, password);
   * });
   *
   * @param {string} email the email to check.
   * @returns {Promise<boolean>} Whether or not the email is available.
   */
  emailAvailable(email: string): Promise<boolean> {
    return Promise.resolve()
      .then(() => {
        if (!email) {
          throw new Error('email must be defined');
        }

        return this.follow('ec:auth/email-available');
      })
      .then((request) => {
        request.withTemplateParameters({ email });
        return get(this[environmentSymbol], request);
      })
      .then(([a]) => <boolean>a.available);
  }

  /**
   * Load a single group.
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
  group(groupID: string): Promise<GroupResource> {
    return <Promise<GroupResource>>this.resource('group', groupID);
  }

  /**
   * Load the {@link GroupList} filtered by the values specified by the options parameter.
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
   *   return show(groups.getAllItems());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<GroupList>} Promise resolving group list
   */
  groupList(options?: filterOptions | any): Promise<GroupList> { // TODO remove any
    return <Promise<GroupList>>this.resourceList('group', options);
  }

  /**
   * Get {@link InvalidPermissionsResource} to show all invalid permissions.
   *
   * @example
   * return accounts.invalidPermissions()
   * .then((invalidPermissions) => Promise.all([
   *   show(invalidPermissions.invalidAccountPermissions),
   *   show(invalidPermissions.invalidGroupPermissions),
   * ]));
   *
   * @returns {Promise<InvalidPermissionsResource>} Promise resolving to invalid permissions
   */
  invalidPermissions(): Promise<InvalidPermissionsResource> {
    return this.follow('ec:invalid-permissions')
      .then(request => get(this[environmentSymbol], request))
      .then(([resource, traversal]) =>
        new InvalidPermissionsResource(resource, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link InviteResource}. Only unused invites are returned.
   * 
   * @param {string} invite invite uuid to request
   * @returns {Promise<InviteResource>} the requested {@link InviteResource}
   */
  invite(invite: string): Promise<InviteResource> {
    return <Promise<InviteResource>>this.resource('invite', invite);
  }

  /**
   * Load the list of {@link InviteResource}s. Only unused invites are in the list.
   * 
   * @param {filterOptions} options filter options you want to have applied
   * @returns {Promise<InviteList>} the requested {@link InviteList}.
   */
  inviteList(options?: filterOptions): Promise<InviteList> {
    return <Promise<InviteList>>this.resourceList('invite', options);
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
  me(): Promise<AccountResource> {
    return Promise.resolve()
      .then(() => this.follow('ec:account'))
      .then(request => get(this[environmentSymbol], request))
      .then(([res, traversal]) => new AccountResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Start a password reset.
   *
   * @example
   * return accounts.resetPassword(email)
   * .then(() => show(`Password reset link send to ${email}`))
   *
   * @param {string} email email of the account
   * @returns {Promise<undefined>} Promise resolving on success
   */
  resetPassword(email: string): Promise<void> {
    return Promise.resolve()
      .then(() => {
        if (!email) {
          throw new Error('email must be defined');
        }
        if (!this[tokenStoreSymbol].hasClientID()) {
          throw new Error('clientID must be set with Account#setClientID(clientID: string)');
        }

        return this.follow('ec:auth/password-reset');
      }).then((request) => {
        request.withTemplateParameters({
          clientID: this[tokenStoreSymbol].getClientID(),
          email,
        });
        return getEmpty(this[environmentSymbol], request);
      });
  }

  /**
   * Set the clientID to use with the Accounts API. Currently only `rest` is supported.
   *
   * @param {string} clientID the clientID.
   * @returns {Accounts} this object for chainability
   */
  setClientID(clientID: string): Accounts {
    if (!clientID) {
      throw new Error('ClientID must be defined');
    }

    this[tokenStoreSymbol].setClientID(clientID);
    return this;
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
   * @param {string?} invite optional invite. Signup can be declined without invite
   * @returns {Promise<string>} Promise resolving the token
   */
  signup(email: string, password: string, invite?: string): Promise<string> {
    return Promise.resolve()
      .then(() => {
        if (!email) {
          throw new Error('email must be defined');
        }
        if (!password) {
          throw new Error('password must be defined');
        }
        if (!this[tokenStoreSymbol].hasClientID()) {
          throw new Error('clientID must be set with Account#setClientID(clientID: string)');
        }

        return this.follow('ec:auth/register');
      })
      .then((request) => {
        request.withTemplateParameters({
          clientID: this[tokenStoreSymbol].getClientID(),
          invite,
        });
        return post(this[environmentSymbol], request, { email, password });
      })
      .then(([token]) => {
        this[tokenStoreSymbol].setToken(token.token);
        return Promise.resolve(token.token);
      });
  }
}

export type tokenResponse = {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}

export type inviteCreateObject = {
  count: number,
  permissions?: Array<string>,
  groups?: Array<inviteCreateGroupObject>,
}

export type inviteCreateGroupObject = {
  groupID: string,
  name: string,
}