import ListResource from '../ListResource';
import BuildResource from './BuildResource';

/**
 * CodeSource list class
 *
 * @class
 */
export default class BuildList extends ListResource {
  /**
   * Creates a new {@link BuildList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/build', undefined, BuildList, BuildResource);
  }
}
