import Resource from '../Resource';
import { environment } from '../ListResource';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this.countProperties();
  }

  get tag() {
    return <string>this.getProperty('tag');
  }

  get count() {
    return <number>this.getProperty('count');
  }
}
