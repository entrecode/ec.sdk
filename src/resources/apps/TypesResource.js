import Resource from '../Resource';

/**
 * TypesResource class
 *
 * @class
 *
 */
export default class TypesResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
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
      platformTypes: {
        enumerable: true,
        get: () => this.getProperty('platformTypes'),
      },
      codeSourceTypes: {
        enumerable: true,
        get: () => this.getProperty('codeSourceTypes'),
      },
      dataSourceTypes: {
        enumerable: true,
        get: () => this.getProperty('dataSourceTypes'),
      },
      targetTypes: {
        enumerable: true,
        get: () => this.getProperty('targetTypes'),
      },
    });
  }

  // TODO getter for schemas
}
