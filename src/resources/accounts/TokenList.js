import ListResource from '../ListResource';
import TokenResource from './TokenResource';

/**
 * Token list class
 *
 * @class
 */
export default class TokenList extends ListResource {
  /**
   * Creates a new {@link TokenList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:account/token', traversal, TokenList, TokenResource);
  }
}
