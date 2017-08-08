import Resource from '../Resource';

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
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      dataSourceID: {
        enumerable: true,
        get: () => this.getProperty('dataSourceID'),
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      dataSourceType: {
        enumerable: true,
        get: () => this.getProperty('dataSourceType'),
        set: (value) => {
          this.setProperty('dataSourceType', value);
          return value;
        },
      },
    });
    this.countProperties();
  }
}
