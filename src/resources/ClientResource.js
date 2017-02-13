import Resource from './Resource';

/**
 * ClientResource class
 *
 * @class
 */
export default class ClientResource extends Resource {
  getClientID() {
    return this.getProperty('clientID');
  }

  getCallbackURL() {
    return this.getProperty('callbackURL');
  }

  getConfig() {
    return this.getProperty('config');
  }

  setCallbackURL(value) {
    if (!value) {
      throw new Error('callbackURL must be defined.');
    }
    return this.setProperty('callbackURL', value);
  }

  setConfig(value) {
    if (!value) {
      throw new Error('config must be defined.');
    }
    return this.setProperty('config', value);
  }
}
