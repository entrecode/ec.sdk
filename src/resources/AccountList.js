import ListResource from './ListResource';
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
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, traversal) {
    super(resource, 'ec:accounts', traversal);
    this.ListClass = AccountList;
    this.ItemClass = AccountResource;
  }
}
