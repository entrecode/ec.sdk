import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * DM Account resource class
 *
 * @class
 *
 * @prop {string}         accountID         - The id of the Account
 * @prop {string}         email             - The current email.
 * @prop {boolean}        hasPassword       - Whether or not this account has a password
 * @prop {Array<string>}  oauth             - Array of connected oauth accounts
 */
export default class DMAccountResource extends Resource {
  /**
   * Creates a new {@link DMAccountResource}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this.countProperties();
  }

  get accountID() {
    return <string>this.getProperty('accountID');
  }

  get email() {
    return <string>this.getProperty('email');
  }

  get hasPassword() {
    return <boolean>this.getProperty('hasPassword');
  }

  get oauth() {
    return <Array<any>>this.getProperty('oauth');
  }
}
