import Resource from '../Resource';
import { environment } from '../../Core';

interface InvalidPermissionsResource {
  invalidAccountPermissions: any;
  invalidGroupPermissions: any;
}

/**
 * InvalidPermissionsResource class
 *
 * @class
 *
 * @prop {Array<Permission>} invalidAccountPermission - Array of invalid permissions linked to a
 *   {@link AccountResource}
 * @prop {Array<Permission>} invalidGroupPermission   - Array of invalid permissions linked to a
 *   {@link GroupResource}
 */
class InvalidPermissionsResource extends Resource {
  /**
   * Creates a new {@link InvalidPermissionsResource}.
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
      invalidAccountPermissions: {
        enumerable: true,
        get: () => this.getProperty('invalidAccountPermissions'),
      },
      invalidGroupPermissions: {
        enumerable: true,
        get: () => this.getProperty('invalidGroupPermissions'),
      },
    });
    this.countProperties();
  }
}

export default InvalidPermissionsResource;
