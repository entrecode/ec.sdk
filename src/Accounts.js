'use strict';

import Core, { get } from './Core';
import ListResource from './resources/ListResource';
import Resource from './resources/Resource';

const urls = {
  live: 'https://accounts.entrecode.de/',
  stage: 'https://accounts.cachena.entrecode.de/',
  staging: 'https://accounts.buffalo.entrecode.de/',
  development: 'http://localhost:7472/',
};

export default class Accounts extends Core {
  constructor(environment, token) {
    super(urls[environment]);
    this.resourceName = 'ec:account';
    if (token) {
      this.traversal.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    }
  }

  list(filters) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:accounts/options')
      .withTemplateParameters(filters);
      return get(request);
    })
    .then(([res, traversal]) => new ListResource(res, this.resourceName, traversal));
  }

  get(accountID) {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:account/by-id')
      .withTemplateParameters({ accountID });
      return get(request);
    })
    .then(([res, traversal]) => new Resource(res, this.resourceName, traversal));
  }
}
