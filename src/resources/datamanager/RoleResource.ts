import Resource from '../Resource';
import { environment } from '../../Core';
import DMAccountResource from './DMAccountResource';
import LiteDMAccountResource from '../publicAPI/LiteDMAccountResource';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');

interface RoleResource {
  accounts: Array<LiteDMAccountResource>,
  addRegistered: boolean,
  addUnregistered: boolean,
  label: string,
  name: string,
  roleID: string,
}

/**
 * Role resource class
 *
 * @class
 *
 * @prop {string} roleID - The id of the role
 * @prop {string} name - The name of the role
 * @prop {string} label - A label for the role
 * @prop {boolean} addUnregistered - Whether or not to add unregistered users to this role
 * @prop {boolean} addRegistered - Whether or not to add registered users to this role
 * @prop {array<LiteDMAccountResource>} accounts - array of accountIDs associated to this role
 */
class RoleResource extends Resource {
  /**
   * Creates a new {@link RoleResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      accounts: {
        enumerable: true,
        get: () => {
          const accounts = this.getProperty('accounts');
          if (accounts.length === 0 || typeof accounts[0] === 'object') {
            return accounts;
          }

          const liteResources = this.getLinks('ec:dm-account');
          if (liteResources) {
            this[resourceSymbol].accounts = liteResources.map(liteResource => new LiteDMAccountResource(liteResource, this[environmentSymbol]));
          }

          return this.getProperty('accounts');
        },
        set: (value: Array<string | LiteDMAccountResource | DMAccountResource>) => {
          this.setProperty('accounts', value.map((res) => {
            if (typeof res === 'string') {
              return res;
            }
            return res.accountID;
          }));
          return this;
        },
      },
      addRegistered: {
        enumerable: true,
        get: () => <boolean>this.getProperty('addRegistered'),
        set: (value: boolean) => this.setProperty('addRegistered', value),
      },
      addUnregistered: {
        enumerable: true,
        get: () => <boolean>this.getProperty('addUnregistered'),
        set: (value: boolean) => this.setProperty('addUnregistered', value),
      },
      label: {
        enumerable: true,
        get: () => <string>this.getProperty('label'),
        set: (value: string) => this.setProperty('label', value),
      },
      name: {
        enumerable: true,
        get: () => <string>this.getProperty('name'),
        set: (value: string) => this.setProperty('name', value),
      },
      roleID: {
        enumerable: true,
        get: () => <string>this.getProperty('roleID'),
      }
    });
    this.countProperties();
  }
}

export default RoleResource;
