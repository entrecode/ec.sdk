import ListResource from '../ListResource';
import PlatformResource from './PlatformResource';

/**
 * Platform list class
 *
 * @class
 */
export default class PlatformList extends ListResource {
  /**
   * Creates a new {@link PlatformList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/platform', undefined, PlatformList, PlatformResource);
  }
}
