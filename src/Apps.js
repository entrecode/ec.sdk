import validator from 'json-schema-remote';

import Core, { environmentSymbol } from './Core';
import { get, optionsToQuery, post } from './helper';
import AppList from './resources/apps/AppList';
import AppResource from './resources/apps/AppResource';
import TypesResource from './resources/apps/TypesResource';
import AppStatsList from './resources/apps/AppStatsList';
import AppStatsResource from './resources/apps/AppStatsResource';

const urls = {
  live: 'https://appserver.entrecode.de/',
  stage: 'https://appserver.cachena.entrecode.de/',
  nightly: 'https://appserver.buffalo.entrecode.de/',
  develop: 'http://localhost:7470/',
};

/**
 * This API connector can be used for Appserver APIs.
 *
 * @class
 */
export default class Apps extends Core {
  /**
   * Creates a new instance of {@link Apps} API connector.
   *
   * @param {?environment} environment the environment to connect to.
   */
  constructor(environment = 'live') {
    if (environment && !{}.hasOwnProperty.call(urls, environment)) {
      throw new Error('invalid environment specified');
    }

    super(urls, environment);
  }

  /**
   * Load a {@link AppList} of {@link AppResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<AppList>} resolves to app list with applied filters.
   */
  appList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'appID' in options
        && (typeof options.appID === 'string' || (!('any' in options.appID) && !('all' in options.appID)))
      ) {
        throw new Error('Providing only an appID in AppList filter will result in single resource response. Please use Apps#app');
      }

      return this.follow('ec:apps/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:apps/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new AppList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link AppResource} identified by appID.
   *
   * @param {string} appID id of the app.
   * @returns {Promise<AppResource>} resolves to the app which should be loaded.
   */
  app(appID) {
    return Promise.resolve()
    .then(() => {
      if (!appID) {
        throw new Error('appID must be defined');
      }
      return this.follow('ec:app/by-id');
    })
    .then((request) => {
      request.withTemplateParameters({ appID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new AppResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Create a new App.
   *
   * @param {object} app object representing the app.
   * @returns {Promise<AppResource>} the newly created AppResource
   */
  create(app) {
    return Promise.resolve()
    .then(() => {
      if (!app) {
        throw new Error('Cannot create resource with undefined object.');
      }
      return this.link('ec:app/by-id');
    })
    .then(link => validator.validate(app, `${link.profile}-template`))
    .then(() => post(this[environmentSymbol], this.newRequest(), app))
    .then(([dm, traversal]) => new AppResource(dm, this[environmentSymbol], traversal));
  }

  /**
   * Load the {@link TypesResource}. This resource contains information about all available plugin
   * types.
   *
   * @returns {Promise<TypesResource>} Promise resolving to types resource.
   */
  types() {
    return Promise.resolve()
    .then(() => this.follow('ec:apps/types'))
    .then(request => get(this[environmentSymbol], request))
    .then(([res, traversal]) => new TypesResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load the {@link AppStatsList}.
   *
   * @example
   * return apps.statsList()
   * .then(stats => {
   *   return show(stats.getAllItems());
   * });
   *
   *
   * @returns {Promise<AppStatsList>} Promise resolving to AppStatsList
   */
  statsList() {
    return Promise.resolve()
    .then(() => this.follow('ec:app-stats'))
    .then(request => get(this[environmentSymbol], request))
    .then(([res, traversal]) => new AppStatsList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link AppStatsResource}.
   *
   * @example
   * return dm.stats('id')
   * .then(stats => {
   *   return show(stats);
   * });
   *
   * @param {string} appID the appID
   * @returns {Promise<AppStatsResource>} Promise resolving to AppStatsResource
   */
  stats(appID) {
    return Promise.resolve()
    .then(() => {
      if (!appID) {
        throw new Error('appID must be defined');
      }
      return this.follow('ec:app-stats');
    })
    .then(request => get(this[environmentSymbol], request.withTemplateParameters({ appID })))
    .then(([res]) => new AppStatsResource(res, this[environmentSymbol]));
  }
}
