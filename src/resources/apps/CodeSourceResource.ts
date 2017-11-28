import Resource from '../Resource';
import { environment } from '../../Core';

interface CodeSourceResource {
  config: any,
  codeSourceID: string,
  codeSourceType: string,
}

/**
 * CodeSourceResource class
 *
 * @class
 *
 * @prop {string} codeSourceID - the id
 * @prop {any} config - additional config, see schema for format
 * @prop {string} codeSourceType - codeSource type
 */
class CodeSourceResource extends Resource {
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
    Object.defineProperties(this, {
      config: {
        get: () => this.getProperty('config'),
        set: (value: any) => this.setProperty('config', value),
      },
      codeSourceID: {
        get: () => <string>this.getProperty('codeSourceID'),
      },
      codeSourceType: {
        get: () => <string>this.getProperty('codeSourceType'),
        set: (value: string) => this.setProperty('codeSourceType', value),
      },
    });
    this.countProperties();
  }
}

export default CodeSourceResource;
