import ListResource from '../ListResource';
import ClientResource from './ClientResource';

/**
 * Client list class
 *
 * @class
 */
export default class ClientList extends ListResource {
  /**
   * Creates a new {@link ClientList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:acc/client', undefined, ClientList, ClientResource);
  }
}
