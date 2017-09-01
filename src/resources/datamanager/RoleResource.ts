import Resource from '../Resource';
import { environment } from '../../Core';

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
export default class RoleResource extends Resource {
  roleID: string;
  name: string;
  label: string;
  addUnregistered: boolean;
  addRegistered: boolean;
  accounts: Array<string>;

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
      roleID: {
        enumerable: true,
        get: () => this.getProperty('roleID'),
      },

      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
        set: (value) => {
          this.setProperty('name', value);
          return value;
        },
      },
      label: {
        enumerable: true,
        get: () => this.getProperty('label'),
        set: (value) => {
          this.setProperty('label', value);
          return value;
        },
      },
      addUnregistered: {
        enumerable: true,
        get: () => this.getProperty('addUnregistered'),
        set: (value) => {
          this.setProperty('addUnregistered', value);
          return value;
        },
      },
      addRegistered: {
        enumerable: true,
        get: () => this.getProperty('addRegistered'),
        set: (value) => {
          this.setProperty('addRegistered', value);
          return value;
        },
      },
      accounts: {
        enumerable: true,
        get: () => this.getProperty('accounts'),
        set: (value) => {
          this.setProperty('accounts', value);
          return value;
        },
      },
    });
    this.countProperties();
  }
}
