import Resource from '../Resource';
import { environment } from '../../Core';

interface RoleResource {
  accounts: Array<string>,
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
 * @prop {stirng} name - The name of the role
 * @prop {string} label - A label for the role
 * @prop {boolean} addUnregistered - Whether or not to add unregistered users to this role
 * @prop {boolean} addRegistered - Whether or not to add registered users to this role
 * @prop {array<string>} accounts - array of accountIDs associated to this role
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
        get: () => <Array<string>>this.getProperty('accounts'),
        set: (value: Array<string>) => this.setProperty('accounts', value),
      },
      addRegistered: {
        get: () => <boolean>this.getProperty('addRegistered'),
        set: (value: boolean) => this.setProperty('addRegistered', value),
      },
      addUnregistered: {
        get: () => <boolean>this.getProperty('addUnregistered'),
        set: (value: boolean) => this.setProperty('addUnregistered', value),
      },
      label: {
        get: () => <string>this.getProperty('label'),
        set: (value: string) => this.setProperty('label', value),
      },
      name: {
        get: () => <string>this.getProperty('name'),
        set: (value: string) => this.setProperty('name', value),
      },
      roleID: {
        get: () => <string>this.getProperty('roleID'),
      }
    });
    this.countProperties();
  }
}

export default RoleResource;
