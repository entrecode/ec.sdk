import ClientList from '../accounts/ClientList';
import DMClientResource from './DMClientResource';

/**
 * Client list class
 *
 * @class
 */
export default class DMClientList extends ClientList {
  /**
   * Creates a new {@link ClientList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:dm-clients', traversal, DMClientList, DMClientResource);
  }
}
