import { get, optionsToQuery } from '../../helper';
import Resource, { environmentSymbol } from '../Resource';
import PlatformList from './PlatformList';
import PlatformResource from './PlatformResource';

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

  /**
   * Load a {@link PlatformList} of {@link PlatformResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<PlatformList>} resolves to app list with applied filters.
   */
  platformList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'platformID' in options
        && (typeof options.platformID === 'string' || (!('any' in options.platformID) && !('all' in options.platformID)))
      ) {
        throw new Error('Cannot filter platformList only by platformID. Use AppResource#platform instead');
      }

      return this.newRequest().follow('ec:app/platforms/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:app/platforms/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PlatformList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link PlatformResource} identified by platformID.
   *
   * @param {string} platformID id of the app.
   * @returns {Promise<PlatformResource>} resolves to the platform which should be loaded.
   */
  platform(platformID) {
    return Promise.resolve()
    .then(() => {
      if (!platformID) {
        throw new Error('platformID must be defined');
      }
      return this.newRequest().follow('ec:app/platforms/options');
    })
    .then((request) => {
      request.withTemplateParameters({ platformID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PlatformResource(res, this[environmentSymbol], traversal));
  }

  // TODO codeSource list
  // TODO codeSource single
  // TODO dataSource list
  // TODO dataSource single
  // TODO target list
  // TODO target single
}
