import Resource from '../Resource';
import { environment } from '../../types';

interface TokenResource {
  accessTokenID: string;
  device: any;
  ipAddress: string;
  ipAddressLocation: string;
  isCurrent: boolean;
  issued: Date;
  validUntil: Date;
}

/**
 * TokenResource class
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
class TokenResource extends Resource {
  /**
   * Creates a new {@link TokenResource}.
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
      accessTokenID: {
        enumerable: true,
        get: () => <string>this.getProperty('accessTokenID'),
      },
      device: {
        enumerable: true,
        get: () => this.getProperty('device'),
      },
      ipAddress: {
        enumerable: true,
        get: () => <string>this.getProperty('ipAddress'),
      },
      ipAddressLocation: {
        enumerable: true,
        get: () => <string>this.getProperty('ipAddressLocation'),
      },
      isCurrent: {
        enumerable: true,
        get: () => <boolean>this.getProperty('isCurrent'),
      },
      issued: {
        enumerable: true,
        get: () => new Date(this.getProperty('issued')),
      },
      validUntil: {
        enumerable: true,
        get: () => new Date(this.getProperty('validUntil')),
      },
    });
    this.countProperties();
  }
}

export default TokenResource;
