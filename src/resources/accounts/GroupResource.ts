import Resource from '../Resource';
import { environment } from '../../Core';
import { isRegExp } from 'util';

const resourceSymbol: any = Symbol.for('resource');

interface GroupResource {
  groupID: string;
  name: string;
  permissions: Array<string>;
  accounts: Array<string | any>;
}

/**
 * GroupResource class
 *
 * @class
 *
 * @prop {string}         groupID     - The id of the group
 * @prop {string}         name        - The group name
 * @prop {Array<string>}  permissions - Array of permissions
 */
class GroupResource extends Resource {
  /**
   * Creates a new {@link GroupResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      groupID: {
        enumerable: true,
        get: () => <string>this.getProperty('groupID'),
      },
      name: {
        enumerable: true,
        get: () => <string>this.getProperty('name'),
        set: (value: string) => this.setProperty('name', value),
      },
      permissions: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('permissions'),
        set: (value: Array<string>) => this.setProperty('permissions', value),
      },
      accounts: {
        enumerable: true,
        get: (): Array<any> => {
          return this.getAccounts();
        },
        set: (accounts: Array<string | any>): Array<string | any> => {
          this.setAccounts(accounts);
          return accounts;
        },
      },
    });
    this.countProperties();
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {GroupResource} this Resource for chainability
   */
  addPermission(value: string): GroupResource {
    if (!value) {
      throw new Error('permission must be defined');
    }

    return this.addPermissions([value]);
  }

  /**
   * Adds a new permissions to permissions array.
   *
   * @param {Array<string>} value the permission to add.
   * @returns {GroupResource} this Resource for chainability
   */
  addPermissions(value: Array<string>): GroupResource {
    if (!value || !Array.isArray(value)) {
      throw new Error('permission must be defined and an array');
    }

    let current = this.permissions;
    current = current.concat(value);
    this.permissions = current;
    return this;
  }

  /**
   * Remove a single permission from this group.
   *
   * @param {string} value the permission to remove
   * @returns {GroupResource} returns this group resource
   */
  removePermission(value: string): GroupResource {
    if (!value) {
      throw new Error('permission must be defined');
    }

    return this.removePermissions([value]);
  }

  /**
   * Remove multiple permissions from this group.
   *
   * @param {Array<string>} value the permissions to remove
   * @returns {GroupResource} returns this group resource
   */
  removePermissions(value: Array<string>) {
    if (!value || !Array.isArray(value)) {
      throw new Error('permission must be defined and an array');
    }

    let current = this.permissions;
    current = current.filter((permission) => value.indexOf(permission) !== -1);
    this.permissions = current;
    return this;
  }

  /**
   * Get the embedded account objects. Will be no account resources, but object containing only accountID and email.
   *
   * @returns {Array<object>} An array of account like objects
   */
  getAccounts(): Array<any> {
    return this[resourceSymbol].embeddedArray('ec:account') || [];
  }

  /**
   * Add an account to this group.
   *
   * @param {string|{accountID: string}} account Account which should be added
   * @returns {GroupResource} returns this group resource
   */
  addAccount(account: string | { accountID: string }): GroupResource {
    if (!account) {
      throw new Error('account must be defined');
    }

    if (typeof account === 'string') {
      account = { accountID: account };
    } else if (typeof account !== 'object' || !('accountID' in account)) {
      throw new Error('account must either be string or account like object');
    }

    let accounts = this.getAccounts();
    accounts.push(account);
    this[resourceSymbol]._embedded['ec:account'] = accounts;

    return this;
  }

  /**
   * Replace all accounts in this GroupResource with a new array.
   *
   * @param accounts The array of accounts you want to contain in this group.
   */
  setAccounts(accounts: Array<string | any>): GroupResource {
    if (!accounts) {
      throw new Error('accounts must be defined');
    }

    if (!Array.isArray(accounts)) {
      throw new Error('accounts must be an array');
    }

    accounts.forEach((a) => {
      if (typeof a !== 'string' && !(typeof a === 'object' && 'accountID' in a)) {
        throw new Error('account items must be string or account like object');
      }
    });

    this[resourceSymbol]._embedded['ec:account'] = accounts.map((a) => (typeof a === 'string' ? { accountID: a } : a));

    return this;
  }

  /**
   * Remove an account from this group.
   *
   * @param {string|{accountID: string}} account Account which should be removed
   * @returns {GroupResource} returns this group resource
   */
  removeAccount(account: string | { accountID: string }): GroupResource {
    if (!account) {
      throw new Error('account must be defined');
    }

    let remove;
    if (typeof account === 'string') {
      remove = { accountID: account };
    } else if (typeof account !== 'object' || !('accountID' in account)) {
      throw new Error('account must either be string or account like object');
    } else {
      remove = account;
    }

    let accounts = this.getAccounts();
    accounts = accounts.filter((acc) => acc.accountID !== remove.accountID);
    this[resourceSymbol]._embedded['ec:account'] = accounts;

    return this;
  }

  static createTransform(group) {
    if ('accounts' in group) {
      if (!('_embedded' in group)) {
        group._embedded = {};
      }
      group._embedded['ec:account'] = group.accounts.map((x) => {
        if (typeof x === 'string') {
          return {
            accountID: x,
          };
        }
        return x;
      });
    }
    return group;
  }
}

export default GroupResource;
