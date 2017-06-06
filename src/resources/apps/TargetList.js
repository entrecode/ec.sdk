import ListResource from '../ListResource';
import TargetResource from './TargetResource';

/**
 * Target list class
 *
 * @class
 */
export default class TargetList extends ListResource {
  /**
   * Creates a new {@link TargetList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/target', undefined, TargetList, TargetResource);
  }
}
