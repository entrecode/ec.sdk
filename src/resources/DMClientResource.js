import ClientResource from './ClientResource';

/**
 * DMClientResource class
 *
 * @class
 *
 * @prop {array<String>} disableStrategies - Strategies disabled in this client.
 * @prop {string}        hexColor          - Strategies disabled in this client.
 */
export default class DMClientResource extends ClientResource {
  /**
   * Creates a new {@link DMClientResource}.
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
  }
}
