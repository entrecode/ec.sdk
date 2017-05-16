import Resource from '../Resource';

/**
 * PublicTag resource class
 *
 * @class
 *
 * @prop {string} tag - tag name
 * @prop {number} count - number of assets with this tag
 */
export default class PublicTagResource extends Resource {
  /**
   * Creates a new {@link PublicTagResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      tag: {
        enumerable: true,
        get: () => this.getProperty('tag'),
      },
      count: {
        enumerable: true,
        get: () => this.getProperty('count'),
      },
    });
  }
}
