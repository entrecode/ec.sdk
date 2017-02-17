import Resource from './Resource';

/**
 * Invites Resource. Will contain an {@link Array} containing all unused invites.
 *
 * @class
 *
 * @prop {Array<string>} invites - Array of unused invites
 */
export default class InvitesResource extends Resource {
  /**
   * Creates a new {@link InvitesResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      invites: {
        enumerable: true,
        get: () => this.getProperty('invites'),
      },
    });
  }
}
