'use strict';

import * as traverson from 'traverson';
import HalAdapter from 'traverson-hal';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

export default class Resource {
  constructor(resourceName, resource, traversal) {
    this._dirty = false;
    this._traversal = traversal;
    this.resourceName = resourceName;
    this.resource = resource;
  }

  dirty() {
    return this._dirty;
  }

  newRequest() {
    return this._traversal.continue().newRequest();
  }

  getObject() {
    return this.resource;
  }

  setProperty(property, value) {
    this._dirty = true;
    this.resource[property] = value;
    return this;
  }

  getProperty(property) {
    return this.resource[property];
  }

  hasLink(link) {
    return {}.hasOwnProperty.call(this.resource._links, link);
  }

  getLink(link) {
    return new Promise((resolve, reject) => {
      this.newRequest()
      .follow(link)
      .getResource((err, res, traversal) => {
        if (err) {
          return reject(err);
        }

        this.resource = res;
        this.resource._traversal = traversal;

        return resolve(this.resource);
      });
    });
  }
}
