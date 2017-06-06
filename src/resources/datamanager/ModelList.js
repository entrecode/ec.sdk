import ListResource from '../ListResource';
import ModelResource from './ModelResource';

/**
 * Model list resource class.
 *
 * @class
 */
export default class ModelList extends ListResource {
  /**
   * Creates a new {@link ModelList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:model', undefined, ModelList, ModelResource);
  }
}
