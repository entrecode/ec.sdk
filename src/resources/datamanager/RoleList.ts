import ListResource from '../ListResource';
import RoleResource from './RoleResource';
import { environment } from '../../Core';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-role', undefined, RoleList, RoleResource);
  }
}
