import Resource from '../Resource';

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
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      codeSourceID: {
        enumerable: true,
        get: () => this.getProperty('codeSourceID'),
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      codeSourceType: {
        enumerable: true,
        get: () => this.getProperty('codeSourceType'),
        set: (value) => {
          this.setProperty('codeSourceType', value);
          return value;
        },
      },
    });
  }
}
