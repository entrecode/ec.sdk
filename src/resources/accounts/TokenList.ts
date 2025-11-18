import ListResource from '../ListResource';
import TokenResource from './TokenResource';
import { environment } from '../../types';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:account/token', undefined, TokenList, TokenResource);
  }
}
