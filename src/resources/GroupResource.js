import Resource from './Resource';

/**
 * GroupResource class
 *
 * @class
 *
 * @prop {string}         groupID     - The id of the group
 * @prop {string}         name        - The group name
 * @prop {Array<string>}  permissions - Array of permissions
 */
export default class GroupResource extends Resource {
  /**
   * Creates a new {@link GroupResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      groupID: {
        enumerable: true,
        get: () => this.getProperty('groupID'),
      },
      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
        set: (value) => {
          this.setProperty('name', value);
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
    });
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {GroupResource} this Resource for chainability
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
}
