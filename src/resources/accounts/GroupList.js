import ListResource from '../ListResource';
import GroupResource from './GroupResource';

/**
 * GroupList list class
 *
 * @class
 */
export default class GroupList extends ListResource {
  /**
   * Creates a new {@link GroupList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:acc/groups', undefined, GroupList, GroupResource);
  }
}
