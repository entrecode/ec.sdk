import Resource from '../Resource';

/**
 * AppResource class
 *
 * @class
 *
 * @prop {string} appID - ID
 * @prop {string} shortID - shortened ID
 * @prop {date} created - created date
 * @prop {string} title - title
 * @prop {string} hexColor - color for frontend usage
 */
export default class AppResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      appID: {
        enumerable: true,
        get: () => this.getProperty('appID'),
      },
      shortID: {
        enumerable: true,
        get: () => this.getProperty('shortID'),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
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

  // TODO platform list
  // TODO platform single
}
