import DeploymentResource from './DeploymentResource';
import ListResource from '../ListResource';
import { environment } from '../../Core';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:app/deployment', undefined, DeploymentList, DeploymentResource);
  }
}
