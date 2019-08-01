import Resource from '../Resource';
import { environment } from '../../Core';

interface TargetResource {
  config: any;
  targetID: string;
  targetType: string;
  title: string;
}

/**
 * TargetResource class
 *
 * @class
 *
 * @prop {string} targetID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} targetType - target type
 */
class TargetResource extends Resource {
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
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value: any) => this.setProperty('config', value),
      },
      targetID: {
        enumerable: true,
        get: () => <string>this.getProperty('targetID'),
      },
      targetType: {
        enumerable: true,
        get: () => <string>this.getProperty('targetType'),
        set: (value: string) => this.setProperty('targetType', value),
      },
      title: {
        enumerable: false,
        get: () => <string>(this.getProperty('config') || {})._title || this.targetType,
        set: (value: string) =>
          this.setProperty('config', Object.assign(this.getProperty('config') || {}, { _title: value || null })),
      },
    });
    this.countProperties();
  }
}

export default TargetResource;
