import ListResource from './ListResource';
import TemplateResource from './TemplateResource';

/**
 * Client list class
 *
 * @class
 */
export default class TemplateList extends ListResource {
  /**
   * Creates a new {@link TemplateList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:dm-template', traversal);
    this.ListClass = TemplateList;
    this.ItemClass = TemplateResource;
  }
}
