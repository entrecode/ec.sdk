import Resource from './Resource';
import TokenList from './TokenList';
import { get } from '../helper';

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
 * @prop {Array<{{sub: string, iss: string, pending: boolean, email: string, name: string}}>}
 *                        openID            - Array of connected openID accounts
 * @prop {Array<string>}  permissions       - Array of permissions
 * @prop {string}         state             - State of the account.
 */
export default class AccountResource extends Resource {
  /**
   * Creates a new {@link AccountResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      accountID: {
        enumerable: true,
        get: () => this.getProperty('accountID'),
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
        enumerable: true,
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
        get: () => this.getProperty('permissions'),
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
  }

  /**
   * Returns an array of all permissions of this account. The array will contain the account
   * permissions and all group permissions.
   *
   * @returns {array<string>} All permissions.
   */
  getAllPermissions() {
    return this.groups
    .map(g => g.permissions)
    .reduce((all, current) => all.concat(current), this.permissions);
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermission(value) {
    if (!value) {
      throw new Error('permission must be defined');
    }

    const current = this.permissions;
    current.push(value);
    this.permissions = current;
    return this;
  }

  /**
   * Load the {@link TokenList} for this account
   *
   * @returns {Promise<TokenList>} Promise resolving the token list
   */
  tokenList() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:account/tokens');

      return get(this.environment, request)
      .then(([tokenList, traversal]) => new TokenList(tokenList, this.environment, traversal));
    });
  }
}
