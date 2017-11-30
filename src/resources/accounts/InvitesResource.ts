import Resource from '../Resource';
import { environment } from '../../Core';

interface InvitesResource {
  invites: Array<string>;
}

/**
 * Invites Resource. Will contain an {@link Array} containing all unused invites.
 *
 * @class
 *
 * @prop {Array<string>} invites - Array of unused invites
 */
class InvitesResource extends Resource {
  /**
   * Creates a new {@link InvitesResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      invites: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('invites'),
      },
    });
    this.countProperties();
  }
}

export default InvitesResource;
