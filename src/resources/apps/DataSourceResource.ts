import Resource from '../Resource';
import { environment } from '../../types';

interface DataSourceResource {
  config: any;
  dataSourceID: string;
  dataSourceType: string;
  title: string;
}

/**
 * DataSourceResource class
 *
 * @class
 *
 * @prop {string} dataSourceID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} dataSourceType - dataSource type
 */
class DataSourceResource extends Resource {
  /**
   * Creates a new {@link DataSourceResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value: any) => this.setProperty('config', value),
      },
      dataSourceID: {
        enumerable: true,
        get: () => <string>this.getProperty('dataSourceID'),
      },
      dataSourceType: {
        enumerable: true,
        get: () => <string>this.getProperty('dataSourceType'),
        set: (value: string) => this.setProperty('dataSourceType', value),
      },
      title: {
        enumerable: false,
        get: () => <string>(this.getProperty('config') || {})._title || this.dataSourceType,
      },
    });
    this.countProperties();
  }
}

export default DataSourceResource;
