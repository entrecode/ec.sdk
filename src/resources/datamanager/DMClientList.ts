import ClientList from '../accounts/ClientList';
import DMClientResource from './DMClientResource';
import ListResource from '../ListResource';
import { environment } from '../../types';

/**
 * Client list class
 *
 * @class
 */
export default class DMClientList extends ListResource {
  /**
   * Creates a new {@link ClientList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-client', undefined, DMClientList, DMClientResource);
  }
}
