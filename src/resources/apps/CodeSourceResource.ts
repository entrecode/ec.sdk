import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * CodeSourceResource class
 *
 * @class
 *
 * @prop {string} codeSourceID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} codeSourceType - codeSource type
 */
export default class CodeSourceResource extends Resource {
  /**
   * Creates a new {@link CodeSourceResource}.
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

  get codeSourceID() {
    return <string>this.getProperty('codeSourceID');
  }

  get config() {
    return this.getProperty('config');
  }

  set config(value: any) {
    this.setProperty('config', value);
  }

  get codeSourceType() {
    return this.getProperty('codeSourceType');
  }

  set codeSourceType(value: string) {
    this.setProperty('codeSourceType', value);
  }
}
