import Resource from '../Resource';
import { environment } from '../../Core';

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
    this.countProperties();
  }

  get config() {
    return this.getProperty('config');
  }

  set config(value) {
    this.setProperty('config', value);
  }

  get targetID() {
    return <string>this.getProperty('targetID');
  }

  get targetType() {
    return <string>this.getProperty('targetType');
  }

  set targetType(value: string) {
    this.setProperty('targetType', value);
  }
}
