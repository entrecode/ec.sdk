import ListResource from '../ListResource';
import CodeSourceResource from './CodeSourceResource';

/**
 * CodeSource list class
 *
 * @class
 */
export default class CodeSourceList extends ListResource {
  /**
   * Creates a new {@link CodeSourceList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/codesource', undefined, CodeSourceList, CodeSourceResource);
  }
}
