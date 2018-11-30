import Resource from '../Resource';
import { environment } from '../../Core';

interface InviteResource {
  invite: string;
  permissions: Array<any>;
  groups: Array<any>;
}

/**
 * InviteResource class
 *
 * @class
 *
 * @prop {string}   tokenID             - The id of this token
 *
 * @prop {object}   device              - Object containing device information
 * @prop {string}   ipAddress           - The IP address
 * @prop {string}   ipAddressLocation   - The location of the IP
 * @prop {boolean}  isCurrent           - True if this is the current token
 * @prop {Date}     issued              - The {@link Date} on which this token was issued
 * @prop {Date}     validUntil          - The {@link Date} this token is valid until
 */
class InviteResource extends Resource {
  /**
   * Creates a new {@link InviteResource}.
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
      invite: {
        enumerable: true,
        get: () => <string>this.getProperty('invite'),
      },
      permissions: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('permissions'),
        set: (value: Array<any>) => this.setProperty('permissions', value),
      },
      groups: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('groups'),
        set: (value: Array<any>) => this.setProperty('groups', value),
      },
    });
    this.countProperties();
  }

  /**
   * Saves this {@link InviteResource}.
   *
   * @returns {Promise<InviteResource>} Promise will resolve to the saved InviteResource. Will
   *   be the same object but with refreshed data.
   */
  save(): Promise<InviteResource> {
    return <Promise<InviteResource>>super.save(false, `${this.getLink('self').profile}-template-put`);
  }
}

export default InviteResource;
