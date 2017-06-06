import ListResource from '../ListResource';
import TemplateResource from './TemplateResource';

/**
 * Template list class
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
    super(resource, environment, traversal, 'ec:dm-template', undefined, TemplateList, TemplateResource);
  }
}
