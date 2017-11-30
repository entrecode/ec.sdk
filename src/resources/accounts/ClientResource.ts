import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * Configuration of a client
 *
 * @typedef {{
 *  tokenMethod: (query|cookie|body),
 *  disableStrategies: Array<'facebook'|'google'|'password'>
 * }} config
 */

export type config = {
  tokenMethod: 'query' | 'cookie' | 'body',
  disableStrategies: Array<'facebook' | 'google' | 'password'>,
}

interface ClientResource {
  callbackURL: string,
  clientID: string,
  config: config,
}

/**
 * ClientResource class
 *
 * @class
 *
 * @prop {string} clientID      - The id of the client
 * @prop {string} callbackURL   - callback URL
 * @prop {config} config        - The config
 */
class ClientResource extends Resource {
  /**
   * Creates a new {@link ClientResource}.
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
      callbackURL: {
        enumerable: true,
        get: () => <string>this.getProperty('callbackURL'),
        set: (value: string) => this.setProperty('callbackURL', value),
      },
      clientID: {
        enumerable: true,
        get: () => <string>this.getProperty('clientID'),
      },
      config: {
        enumerable: true,
        get: () => <config>this.getProperty('config'),
        set: (value: config) => this.setProperty('config', value),
      },
    });
    this.countProperties();
  }
}

export default ClientResource;
