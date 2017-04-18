import Resource from '../Resource';

/**
 * ClientResource class
 *
 * @class
 *
 * @prop {string} clientID      - The id of the client
 * @prop {string} callbackURL   - callback URL
 * @prop {object} config        - The config
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
  constructor(resource, environment, traversal) {
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
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
    });
  }
}

/**
 * Configuration of a client
 *
 * @typedef {{
 *  tokenMethod: (query|cookie|body),
 *  disableStrategies: Array<(facebook|google|password)>
 * }} config
 */
