import ListResource from '../ListResource';
import AppResource from './AppResource';

/**
 * App list class
 *
 * @class
 */
export default class AppList extends ListResource {
  /**
   * Creates a new {@link AppList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app', undefined, AppList, AppResource);
  }
}
