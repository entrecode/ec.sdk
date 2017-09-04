import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * DataSourceResource class
 *
 * @class
 *
 * @prop {string} dataSourceID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} dataSourceType - dataSource type
 */
export default class DataSourceResource extends Resource {
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
    this.countProperties();
  }

  get dataSourceID() {
    return <string>this.getProperty('dataSourceID');
  }

  get config() {
    return this.getProperty('config');
  }

  set config(value: any) {
    this.setProperty('config', value);
  }

  get dataSourceType() {
    return <string>this.getProperty('dataSourceType');
  }

  set dataSourceType(value: string) {
    this.setProperty('dataSourceType', value);
  }
}
