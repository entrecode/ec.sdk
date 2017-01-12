'use strict';

import Core, {get} from './Core';
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

  list(filters) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamanagers/options')
      .withTemplateParameters(filters);
      return get(request);
    })
    .then(([res, traversal]) => new DataManagerList(res, this.resourceName, traversal));
  }

  get(dataManagerID) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:datamanager/by-id')
      .withTemplateParameters({ dataManagerID });
      return get(request);
    })
    .then(([res, traversal]) => new DataManagerResource(res, this.resourceName, traversal));
  }
}
