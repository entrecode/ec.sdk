import ListResource from '../ListResource';
import InviteResource from './InviteResource';
import { environment } from '../../Core';

/**
 * Invite list class
 *
 * @class
 */
export default class InviteList extends ListResource {
  /**
   * Creates a new {@link InviteList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:invite', undefined, InviteList, InviteResource);
  }
}
