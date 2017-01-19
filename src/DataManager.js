'use strict';

import Core, { get, optionsToQuery } from './Core';
import DataManagerResource from './resources/DataManagerResource';
import DataManagerList from './resources/DataManagerList';

const urls = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  staging: 'https://datamanager.buffalo.entrecode.de/',
  development: 'http://localhost:7471/',
};

export default class DataManager extends Core {
  constructor(environment, token) {
    super(urls[environment]);
    this.resourceName = 'ec:datamanager';
    if (token) {
      this.traversal.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    }
  }

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

  get(dataManagerID) {
    if (!dataManagerID) {
      throw new Error('dataManagerID must be defined');
    }
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:datamanager/by-id')
      .withTemplateParameters({ dataManagerID });
      return get(request);
    })
    .then(([res, traversal]) => new DataManagerResource(res, this.resourceName, traversal));
  }
}
