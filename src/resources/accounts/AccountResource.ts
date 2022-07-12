import * as ShiroTrie from 'shiro-trie';

import Resource from '../Resource';
import TokenList from './TokenList';
import { environment } from '../../Core';
import TokenResource from './TokenResource';
import { tokenResponse } from '../../Accounts';
import { post } from '../../helper';

const relationsSymbol: any = Symbol.for('relations');
const environmentSymbol: any = Symbol.for('environment');

interface AccountResource {
  accountID: string;
  created: Date;
  email: string;
  groups: Array<any>;
  hasPassword: boolean;
  hasPendingEmail: boolean;
  language: string;
  name: string;
  openID: Array<any>;
  permissions: Array<string>;
  state: string;
}

/**
 * Account resource class
 *
 * @class
 *
 * @prop {string}         accountID         - The id of the Account
 * @prop {Date}           created           - The {@link Date} on which this account was created
 * @prop {string}         email             - The current email. Can be changed with {@link
 *   Accounts#changeEmail}
 * @prop {Array<object>}  groups            - Array of groups this account is member of
 * @prop {boolean}        hasPassword       - Whether or not this account has a password
 * @prop {boolean}        hasPendingEmail   - Whether or not this account has a pending email
 * @prop {string}         language          - The language for frontend usage
 * @prop {Array<{sub: string, iss: string, pending: boolean, email: string, name: string}>}
 *                        openID            - Array of connected openID accounts
 * @prop {Array<string>}  permissions       - Array of permissions
 * @prop {string}         state             - State of the account.
 */
class AccountResource extends Resource {
  /**
   * Creates a new {@link AccountResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    this[relationsSymbol] = {
      token: {
        relation: 'ec:account/tokens/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accessTokenID',
        additionalTemplateParam: 'accountID',
        ResourceClass: TokenResource,
        ListClass: TokenList,
      },
    };

    Object.defineProperties(this, {
      accountID: {
        enumerable: true,
        get: () => <string>this.getProperty('accountID'),
      },

      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      email: {
        enumerable: true,
        get: () => this.getProperty('email'),
      },
      groups: {
        enumerable: false,
        get: () => this.getProperty('groups'),
      },
      hasPassword: {
        enumerable: true,
        get: () => this.getProperty('hasPassword'),
      },
      hasPendingEmail: {
        enumerable: true,
        get: () => this.getProperty('hasPendingEmail'),
      },
      language: {
        enumerable: true,
        get: () => this.getProperty('language'),
        set: (value) => {
          this.setProperty('language', value);
          return value;
        },
      },
      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
        set: (value) => {
          this.setProperty('name', value);
          return value;
        },
      },
      openID: {
        enumerable: true,
        get: () => this.getProperty('openID'),
        set: (value) => {
          this.setProperty('openID', value);
          return value;
        },
      },
      permissions: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('permissions'),
        set: (value) => {
          this.setProperty('permissions', value);
          return value;
        },
      },
      state: {
        enumerable: true,
        get: () => this.getProperty('state'),
        set: (value) => {
          this.setProperty('state', value);
          return value;
        },
      },
    });
    this.countProperties();
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermission(value: string): AccountResource {
    if (!value) {
      throw new Error('permission must be defined');
    }

    const current = this.permissions;
    current.push(value);
    this.permissions = current;
    return this;
  }

  /**
   * Adds new permissions to permissions array.
   *
   * @param {Array<string>} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermissions(value: Array<string>): AccountResource {
    if (!value || !Array.isArray(value)) {
      throw new Error('permission must be defined');
    }

    let current = this.permissions;
    current = current.concat(value);
    this.permissions = current;
    return this;
  }

  /**
   * Check if this Account has a given permission
   *
   * @param {string} permission the permission to check
   * @returns {boolean} true if the Account has this permission, false otherwise
   */
  checkPermission(permission: string): boolean {
    if (!permission) {
      throw new Error('permission must be defined');
    }

    const trie = ShiroTrie['new']();
    trie.add(this.getAllPermissions());

    return trie.check(permission);
  }

  /**
   * Queries the Accounts permissions. See [shiro-trie](https://www.npmjs.com/package/shiro-trie).
   *
   * @param {string} query the permission string to be queried
   * @returns {Array<string>} an array of available permissions
   */
  queryPermissions(query: String): Array<string> {
    if (!query) {
      throw new Error('query musst be defined');
    }

    const trie = ShiroTrie['new']();
    trie.add(this.getAllPermissions());

    return trie.permissions(query);
  }

  /**
   * Returns an array of all permissions of this account. The array will contain the account
   * permissions and all group permissions.
   *
   * @returns {array<string>} All permissions.
   */
  getAllPermissions(): Array<string> {
    return (this.groups ? this.groups : [{ permissions: [] }])
      .map((g) => g.permissions)
      .reduce((all, current) => all.concat(current), this.permissions);
  }

  /**
   * Load the {@link TokenList} for this account
   *
   * @returns {Promise<TokenList>} Promise resolving the token list
   */
  tokenList(): Promise<TokenList> {
    return <Promise<TokenList>>this.resourceList('token');
  }

  /**
   * Create an additional access token {@link tokenResponse} for this account.
   * Only supported for API Keys.
   * 
   * @example
   * return account.createToken()
   * .then(({ jwt, accountID, iat, exp}) => { 
   *   // do something with `jwt` because it is not accessable later
   * });
   * 
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token response.
   * @throws {Error} if the account is not an API Key
   */
  createToken(): Promise<tokenResponse> {
    if (this.email || this.hasPassword || this.state !== 'active') {
      throw new Error('Cannot create token for this account. Only API Token Accounts can get an addtional token.');
    }
    return this.follow('ec:account/tokens')
      .then((request) => post(this[environmentSymbol], request))
      .then(([tokenResponse]) => tokenResponse);
  }

  // TODO remove permission
}

export default AccountResource;
