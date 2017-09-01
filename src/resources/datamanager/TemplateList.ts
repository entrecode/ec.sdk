import TemplateResource from './TemplateResource';
import ListResource from '../ListResource';
import { environment } from '../../Core';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-template', undefined, TemplateList, TemplateResource);
  }
}
