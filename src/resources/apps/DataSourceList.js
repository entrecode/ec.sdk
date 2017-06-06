import ListResource from '../ListResource';
import DataSourceResource from './DataSourceResource';

/**
 * DataSource list class
 *
 * @class
 */
export default class DataSourceList extends ListResource {
  /**
   * Creates a new {@link DataSourceList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:app/dataSource', undefined, DataSourceList, DataSourceResource);
  }
}
