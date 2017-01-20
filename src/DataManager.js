'use strict';

import Core, { get, optionsToQuery } from './Core';
import DataManagerResource from './resources/DataManagerResource';
import DataManagerList from './resources/DataManagerList';

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
   * @param {string} environment the environment to connect to. 'live', 'stage', 'nightly', or
   *   'develop'.
   * @param {?string} token optionally a jwt token to use for authentication.
   */
  constructor(environment, token) {
    if (!{}.hasOwnProperty.call(urls, environment)) {
      throw new Error('invalid environment specified');
    }

    super(urls[environment]);

    this.resourceName = 'ec:datamanager';
    if (token) {
      this.traversal.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    }
  }

  /**
   * Load a {@link DataManagerList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {{size: number, page: number, sort: array<string>, filter: filter}} options the
   *   filter options.
   * @returns {Promise.<DataManagerList>} resolves to datamanager list with applied filters.
   */
  list(options) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamanagers/options')
      .withTemplateParameters(optionsToQuery(options));
      return get(request);
    })
    .then(([res, traversal]) => new DataManagerList(res, this.resourceName, traversal));
  }

  /**
   * Get a single {@link DataManagerResource} identified by dataManagerID.
   *
   * @param {string} dataManagerID id of the DataManager.
   * @returns {Promise.<DataManagerResource>} resolves to the DataManager which should be loaded.
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
      return get(request);
    })
    .then(([res, traversal]) => new DataManagerResource(res, this.resourceName, traversal));
  }
}

/**
 *
 * This object should contain key value pairs with filter options. These object will be applied
 * when loading a {@link ListResource}.
 *
 * @example
 * {
 *   title: 'Recipe Book',
 *   created: {
 *     to: new Date().toISOString()
 *   },
 *   description: {
 *     search: 'desserts'
 *   }
 * }
 *
 * @typedef {{propertyNames: (string|{exact: string, search: string, from: string, to: string, any:
 *   array<string>, all: array<string>})}} filter
 */
