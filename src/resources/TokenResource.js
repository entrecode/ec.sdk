import Resource from './Resource';

/**
 * TokenResource class
 *
 * @class
 */
export default class TokenResource extends Resource {
  /**
   * Whether or not this is the token which is used by the current session.
   *
   * @returns {boolean} whether or not this is the current token
   */
  isCurrent() {
    return this.getProperty('isCurrent');
  }

  /**
   * Issued {@link Date} for this token.
   *
   * @returns {Date} issued date
   */
  issued() {
    return new Date(this.getProperty('issued'));
  }

  /**
   * Valid until {@link Date} for this token.
   *
   * @returns {Date} valid until date
   */
  validUntil() {
    return new Date(this.getProperty('validUntil'));
  }

  /**
   * Will return ipAddress property.
   *
   * @returns {string} the ipAddress.
   */
  getIpAddress() {
    return this.getProperty('ipAddress');
  }

  /**
   * Will return ipAddressLocation property.
   *
   * @returns {string} the ipAddressLocation.
   */
  getIpAddressLocation() {
    return this.getProperty('ipAddressLocation');
  }

  /**
   * Will return accessTokenID property.
   *
   * @returns {string} the token id.
   */
  getAccessTokenID() {
    return this.getProperty('accessTokenID');
  }

  /**
   * Will return device property.
   *
   * @returns {object} the device property.
   */
  getDevice() {
    return this.getProperty('device');
  }
}
