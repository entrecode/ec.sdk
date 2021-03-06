import Resource from '../Resource';
import { environment } from '../../Core';

interface PublicTagResource {
  count: number;
  tag: string;
}

/**
 * PublicTag resource class
 *
 * @class
 *
 * @prop {string} tag - tag name
 * @prop {number} count - number of assets with this tag
 */
class PublicTagResource extends Resource {
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
    Object.defineProperties(this, {
      count: {
        enumerable: true,
        get: () => <number>this.getProperty('count'),
      },
      tag: {
        enumerable: true,
        get: () => <string>this.getProperty('tag'),
      },
    });
    this.countProperties();
  }
}

export default PublicTagResource;
