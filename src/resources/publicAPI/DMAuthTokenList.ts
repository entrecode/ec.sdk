import DMAuthTokenResource from './DMAuthTokenResource';
import ListResource from '../ListResource';
import { environment } from '../../Core';

/**
 * Tag list resource class.
 *
 * @class
 */
export default class DMAuthTokenList extends ListResource {
  /**
   * Creates a new {@link DMAuthTokenList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-authtoken', undefined, DMAuthTokenList, DMAuthTokenResource);
  }
}
