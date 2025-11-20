import Resource from '../Resource';
import { environment } from '../../types';
import { post } from '../../helper';

interface InviteResource {
  invite: string;
  permissions: Array<any>;
  groups: Array<any>;
}

const environmentSymbol: any = Symbol.for('environment');

/**
 * InviteResource class
 *
 * @class
 *
 * @prop {string} invite      - The invite
 *
 * @prop {array}  permissions - Permissions added to the invite
 * @prop {arry}   groups      - Groups added to the invite
 * @prop {string} email       - The email address of the invite
 * @prop {Date}   expires     - The date the invite expires
 * @pros {Date}   created     - The date the invite was created
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
      email: {
        enumerable: true,
        get: () => <string>this.getProperty('email'),
        set: (value: string) => this.setProperty('email', value),
      },
      expires: {
        enumerable: true,
        get: () => new Date(this.getProperty('expires')),
        set: (value: Date) => this.setProperty('expires', value.toISOString()),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
        set: (value: Date) => this.setProperty('created', value.toISOString()),
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

  async resendInvite(): Promise<void> {
    if (!this.email) {
      throw new Error('Cannot resend invite without an email address');
    }
    await post(this[environmentSymbol], await this.newRequest().follow('sendByMail'));
  }
}

export default InviteResource;
