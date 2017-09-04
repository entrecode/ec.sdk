import Resource from '../Resource';
import { environment } from '../../Core';

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
export default class TokenResource extends Resource {
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
    this.countProperties();
  }

  get accessTokenID() {
    return <string>this.getProperty('accessTokenID')
  }

  get device() {
    return this.getProperty('device')
  }

  get ipAddress() {
    return <string>this.getProperty('ipAddress')
  }

  get ipAddressLocation() {
    return <string>this.getProperty('ipAddressLocation')
  }

  get isCurrent() {
    return <boolean>this.getProperty('isCurrent')
  }

  get issued() {
    return new Date(this.getProperty('issued'))
  }

  get validUntil() {
    return new Date(this.getProperty('validUntil'))
  }
}
