import ListResource from '../ListResource';
import DMAccountResource from './DMAccountResource';

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
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:dm-account', traversal);
    this.ListClass = DMAccountList;
    this.ItemClass = DMAccountResource;
  }
}