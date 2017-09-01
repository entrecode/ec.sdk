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
  accountID: string;
  hasPassword: boolean;
  email: string;
  oauth: Array<any>;

  /**
   * Creates a new {@link DMAccountResource}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      accountID: {
        enumerable: true,
        get: () => this.getProperty('accountID'),
      },

      email: {
        enumerable: true,
        get: () => this.getProperty('email'),
      },
      hasPassword: {
        enumerable: true,
        get: () => this.getProperty('hasPassword'),
      },
      oauth: {
        enumerable: true,
        get: () => this.getProperty('oauth'),
      },
    });
    this.countProperties();
  }
}
