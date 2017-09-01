import Resource from '../Resource';
import { environment } from '../ListResource';

/**
 * TargetResource class
 *
 * @class
 *
 * @prop {string} targetID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} targetType - target type
 */
export default class TargetResource extends Resource {
  targetID: string;
  config: any;
  targetType: string;

  /**
   * Creates a new {@link TargetResource}.
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
      targetID: {
        enumerable: true,
        get: () => this.getProperty('targetID'),
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      targetType: {
        enumerable: true,
        get: () => this.getProperty('targetType'),
        set: (value) => {
          this.setProperty('targetType', value);
          return value;
        },
      },
    });
    this.countProperties();
  }
}
