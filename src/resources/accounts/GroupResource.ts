import Resource from '../Resource';
import { environment } from '../../Core';

interface GroupResource {
  groupID: string,
  name: string,
  permissions: Array<string>,
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
        get: () => <string>this.getProperty('groupID'),
      },
      name: {
        get: () => <string>this.getProperty('name'),
        set: (value: string) => this.setProperty('name', value),
      },
      permissions: {
        get: () => <Array<string>> this.getProperty('permissions'),
        set: (value: Array<string>) => this.setProperty('permissions', value),
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

    const current = this.permissions;
    current.push(value);
    this.permissions = current;
    return this;
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

  // TODO remove permission
}

export default GroupResource;
