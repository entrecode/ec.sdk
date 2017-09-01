import DMAccountResource from './DMAccountResource';
import ListResource from '../ListResource';
import { environment } from '../../Core';

/**
 * Account list resource class.
 *
 * @class
 */
export default class DMAccountList extends ListResource {
  /**
   * Creates a new {@link DMAccountList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-account', undefined, DMAccountList, DMAccountResource);
  }
}
