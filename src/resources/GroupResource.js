import Resource from './Resource';

/**
 * GroupResource class
 *
 * @class
 */
export default class GroupResource extends Resource {
  /**
   * Will return groupID property.
   *
   * @returns {string} the groupID.
   */
  getGroupID() {
    return this.getProperty('groupID');
  }

  /**
   * Will return name property.
   *
   * @returns {string} the name.
   */
  getName() {
    return this.getProperty('name');
  }

  /**
   * Set a new value to name property.
   *
   * @param {string} value the value to assign.
   * @returns {GroupResource} this Resource for chainability
   */
  setName(value) {
    if (!value) {
      throw new Error('name must be defined');
    }

    return this.setProperty('name', value);
  }

  /**
   * Will return permissions property.
   *
   * @returns {array<string>} the config.
   */
  getPermissions() {
    return this.getProperty('permissions');
  }

  /**
   * Set a new value to permissions property.
   *
   * @param {array<string>} value the value to assign.
   * @returns {GroupResource} this Resource for chainability
   */
  setPermissions(value) {
    if (!value) {
      throw new Error('permissions must be defined');
    }

    return this.setProperty('permissions', value);
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

    const current = this.getPermissions();
    current.push(value);
    return this.setPermissions(current);
  }
}
