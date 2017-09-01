import ListResource, { environment } from '../ListResource';
import DataManagerResource from './DataManagerResource';

/**
 * DataManager list resource class.
 *
 * @class
 */
export default class DataManagerList extends ListResource {
  /**
   * Creates a new {@link DataManagerList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:datamanager', undefined, DataManagerList, DataManagerResource);
  }
}
