import Core from './Core';
import { get, optionsToQuery } from './helper';
import DataManagerResource from './resources/DataManagerResource';
import DataManagerList from './resources/DataManagerList';
import TokenStoreFactory from './TokenStore';

const urls = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  nightly: 'https://datamanager.buffalo.entrecode.de/',
  develop: 'http://localhost:7471/',
};

/**
 * Module for working with DataManager API.
 *
 * @class
 * @module
 */
export default class DataManager extends Core {
  /**
   * Creates a new instance of {@link DataManager} module. Can be used to work with DataManager
   * API.
   *
   * @param {?string} environment the environment to connect to. 'live', 'stage', 'nightly', or
   *   'develop'.
   */
  constructor(environment) {
    if (environment && !{}.hasOwnProperty.call(urls, environment)) {
      throw new Error('invalid environment specified');
    }

    super(urls[environment || 'live']);
    this.environment = environment;
    this.tokenStore = TokenStoreFactory(environment || 'live');
  }

  /**
   * Load a {@link DataManagerList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {{size: number, page: number, sort: array<string>, filter: filter}} options the
   *   filter options.
   * @returns {Promise<DataManagerList>} resolves to datamanager list with applied filters.
   */
  list(options) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamanagers/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DataManagerList(res, this.environment, traversal));
  }

  /**
   * Get a single {@link DataManagerResource} identified by dataManagerID.
   *
   * @param {string} dataManagerID id of the DataManager.
   * @returns {Promise<DataManagerResource>} resolves to the DataManager which should be loaded.
   */
  get(dataManagerID) {
    if (!dataManagerID) {
      throw new Error('dataManagerID must be defined');
    }
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamanager/by-id')
      .withTemplateParameters({ dataManagerID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DataManagerResource(res, this.environment,  traversal));
  }
}
