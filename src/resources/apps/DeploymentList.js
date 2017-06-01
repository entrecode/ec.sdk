import ListResource from '../ListResource';
import DeploymentResource from './DeploymentResource';

/**
 * CodeSource list class
 *
 * @class
 */
export default class DeploymentList extends ListResource {
  /**
   * Creates a new {@link DeploymentList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/deployment', undefined, DeploymentList, DeploymentResource);
  }
}
