'use strict';

import {default as Core, traversonGet} from './Core';
import ListResource from './ListResource';
import Resource from './Resource';

const url = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  staging: 'https://datamanager.buffalo.entrecode.de/',
  development: 'http://localhost:7471/',
};

export default class DataManager extends Core {
  constructor(environment, token) {
    super(url[environment]);
    if (token) {
      this.traverson.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    }
  }

  list(filters) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamanagers/options')
      .withTemplateParameters(filters);
      return traversonGet(request);
    })
    .then(([res, traversal]) => new ListResource('ec:datamanager', res, traversal));
  }

  get(dataManagerID) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:datamanager/by-id')
      .withTemplateParameters({ dataManagerID });
      return traversonGet(request);
    })
    .then(([res, traversal]) => new Resource('ec:datamanager', res, traversal));
  }
}
