import validator from 'json-schema-remote';

import Core, { environmentSymbol } from './Core';
import { get, post, optionsToQuery } from './helper';
import AppList from './resources/apps/AppList';
import AppResource from './resources/apps/AppResource';

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

  // TODO Types resource
  // TODO app-stats resource
}
