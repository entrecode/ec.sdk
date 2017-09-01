import Resource from '../Resource';
import { environment } from '../ListResource';

/**
 * DMClientResource class
 *
 * @class
 *
 * @prop {string} clientID - name/id of this client.
 * @prop {string} callbackURL - url used for callback requests
 * @prop {{tokenMethod: (query|cookie|body),disableStrategies:
 *   Array<'facebook'|'google'|'password'>}} config - Configuration for this client.
 * @prop {string}        hexColor          - Strategies disabled in this client.
 * @prop {array<String>} disableStrategies - Strategies disabled in this client.
 */
export default class DMClientResource extends Resource {
  clientID: string;
  callbackURL: string;
  config: config;
  hexColor: string;
  disableStrategies: Array<string>;

  /**
   * Creates a new {@link DMClientResource}.
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
      clientID: {
        enumerable: true,
        get: () => this.getProperty('clientID'),
      },
      callbackURL: {
        enumerable: true,
        get: () => this.getProperty('callbackURL'),
        set: (value) => {
          this.setProperty('callbackURL', value);
          return value;
        },
      },
      disableStrategies: {
        enumerable: true,
        get: () => this.getProperty('disableStrategies'),
        set: (value) => {
          this.setProperty('disableStrategies', value);
          return value;
        },
      },
      hexColor: {
        enumerable: true,
        get: () => this.getProperty('hexColor'),
        set: (value) => {
          this.setProperty('hexColor', value);
          return value;
        },
      },
    });
    this.countProperties();
  }
}

type config = {
  tokenMethod: 'query' | 'cookie' | 'body',
  disableStrategies: Array<'facebook' | 'google' | 'password'>,
}
