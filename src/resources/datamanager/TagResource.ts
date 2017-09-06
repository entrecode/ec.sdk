import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * Tag resource class
 *
 * @class
 *
 * @prop {string} tag - tag name
 * @prop {number} count - number of assets with this tag
 */
export default class TagResource extends Resource {
  /**
   * Creates a new {@link TagResource}.
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

  get count() {
    return <number>this.getProperty('count');
  }

  get tag() {
    return <string>this.getProperty('tag');
  }

  set tag(val: string) {
    this.setProperty('tag', val);
  }
}
