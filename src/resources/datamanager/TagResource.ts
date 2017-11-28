import Resource from '../Resource';
import { environment } from '../../Core';

interface TagResource {
  count: number,
  tag: string,
}

/**
 * Tag resource class
 *
 * @class
 *
 * @prop {string} tag - tag name
 * @prop {number} count - number of assets with this tag
 */
class TagResource extends Resource {
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
    Object.defineProperties(this, {
      count: {
        get: () => <number>this.getProperty('count'),
      },
      tag: {
        get: () => <string>this.getProperty('tag'),
        set: (val: string) => this.setProperty('tag', val),
      },
    });
    this.countProperties();
  }
}

export default TagResource
