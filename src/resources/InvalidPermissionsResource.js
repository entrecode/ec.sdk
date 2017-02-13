import Resource from './Resource';

/**
 * InvalidPermissionsResource class
 *
 * @class
 */
export default class InvalidPermissionsResource extends Resource {
  /**
   * Get an array of invalid permissions associated with an {@link AccountResource}.
   *
   * @returns {Array<any>} Array of invalid permissions
   */
  getInvalidAccountPermissions() {
    return this.getProperty('invalidAccountPermissions');
  }

  /**
   * Get an array of invalid permissions associated with a {@link GroupResource}.
   *
   * @returns {Array<any>} Array of invalid permissions
   */
  getInvalidGroupPermissions() {
    return this.getProperty('invalidGroupPermissions');
  }
}
