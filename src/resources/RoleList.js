import ListResource from './ListResource';
import RoleResource from './RoleResource';

/**
 * Client list class
 *
 * @class
 */
export default class RoleList extends ListResource {
  /**
   * Creates a new {@link RoleList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:dm-roles', traversal);
    this.ListClass = RoleList;
    this.ItemClass = RoleResource;
  }
}
