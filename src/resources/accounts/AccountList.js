import ListResource from '../ListResource';
import AccountResource from './AccountResource';

/**
 * Account list resource class.
 *
 * @class
 */
export default class AccountList extends ListResource {
  /**
   * Creates a new {@link AccountList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:account', traversal, AccountList, AccountResource);
  }
}
