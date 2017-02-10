import Resource from './Resource';

/**
 * Invites Resource. Will contain an {@link Array} containing all unused invites.
 */
export default class InvitesResource extends Resource {
  /**
   * Get the invites {@link Array}
   *
   * @returns {Array<string>} Array containing unused invites
   */
  getInvites() {
    return this.getProperty('invites');
  }
}
