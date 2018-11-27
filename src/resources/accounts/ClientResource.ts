import Resource from '../Resource';
import { environment } from '../../Core';

export type clientConfig = {
  tokenMethod: 'query' | 'cookie' | 'body';
  disableStrategies: Array<'facebook' | 'google' | 'password'>;
};

interface ClientResource {
  callbackURL: string,
  clientID: string,
  config: clientConfig,
}

/**
 * ClientResource class
 *
 * @class
 *
 * @prop {string} clientID      - The id of the client
 * @prop {string} callbackURL   - callback URL
 * @prop {clientConfig} config  - The config
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
        get: () => <clientConfig>this.getProperty('config'),
        set: (value: clientConfig) => this.setProperty('config', value),
      },
    });
    this.countProperties();
  }
}

export default ClientResource;

/**
 * Configuration of a client
 *
 * @typedef {Object} clientConfig
 * @property {string} tokenMethod Enum('query'|'cookie'|'body')
 * @property {Array<string>} disableStrategies Array<Enum('facebook'|'google'|'password')>
 */
