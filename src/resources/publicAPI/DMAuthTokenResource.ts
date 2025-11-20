import Resource from '../Resource';
import { environment } from '../../types';

interface DMAuthTokenResource {
  created: Date;
  validUntil: Date;
  near: string;
  device: string;
  isCurrent: boolean;
}

/**
 * DMAuthToken resource class
 *
 * @class
 *
 * @prop {Date} created - "issued at" date
 * @prop {Date} validUntil - expiration date of the token
 * @prop {string} near - IP Address Location
 * @prop {string} device - Device Information
 * @prop {boolean} isCurrent - true if this is the currently active token
 */
class DMAuthTokenResource extends Resource {
  /**
   * Creates a new {@link DMAuthTokenResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      validUntil: {
        enumerable: true,
        get: () => new Date(this.getProperty('validUntil')),
      },
      near: {
        enumerable: true,
        get: () => <string>this.getProperty('near'),
      },
      device: {
        enumerable: true,
        get: () => <string>this.getProperty('device'),
      },
      isCurrent: {
        enumerable: true,
        get: () => <boolean>this.getProperty('isCurrent'),
      },
    });
    this.countProperties();
  }
}

export default DMAuthTokenResource;
