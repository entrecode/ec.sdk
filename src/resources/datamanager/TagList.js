import ListResource from '../ListResource';
import TagResource from './TagResource';

/**
 * Tag list resource class.
 *
 * @class
 */
export default class TagList extends ListResource {
  /**
   * Creates a new {@link AccountList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:tag', traversal);
    this.ListClass = TagList;
    this.ItemClass = TagResource;
  }
}
