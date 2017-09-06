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

/**
 * ClientResource class
 *
 * @class
 *
 * @prop {string} clientID      - The id of the client
 * @prop {string} callbackURL   - callback URL
 * @prop {config} config        - The config
 */
export default class ClientResource extends Resource {
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
    this.countProperties();
  }

  get callbackURL() {
    return <string>this.getProperty('callbackURL');
  }

  set callbackURL(value: string) {
    this.setProperty('callbackURL', value);
  }

  get clientID() {
    return <string>this.getProperty('clientID');
  }

  get config() {
    return <config>this.getProperty('config');
  }

  set config(value: config) {
    this.setProperty('config', value);
  }
}
