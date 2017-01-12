'use strict';

import * as traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import halfred from 'halfred';

import {get, put, del} from '../Core';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

export default class Resource {
  constructor(resource, name, traversal) {
    this.dirty = false;
    this.resource = halfred.parse(resource);
    this.name = name || Object.keys(this.resource.allEmbeddedResources())[0];

    if (traversal) {
      this._traversal = traversal;
    } else {
      traverson.from(this.resource.link('self').href).jsonHal()
      .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
    }
  }

  newRequest() {
    return this._traversal.continue().newRequest();
  }

  isDirty() {
    return this.dirty;
  }

  reset() {
    this.resource = halfred.parse(this.resource.original());
    this.dirty = false;
  }

  save() {
    // TODO add validation
    return put(
      this.newRequest().follow('self'),
      // TODO does this Object.assign work how I want it to?
      // or do we need for(key in obj) loop?
      Object.assign(this.resource.original(), this.resource)
    )
    .then(([res, traversal]) => {
      this.resource = halfred.parse(res);
      this.traversal = traversal;
    });
  }

  del() {
    return del(this.newRequest().follow('self'));
  }

  hasLink(link) {
    return this.resource.link(link) !== null;
  }

  getLink(link) {
    return this.resource.link(link);
  }

  followLink(link) {
    return get(this.newRequest().follow(link))
    .then(([res, traversal]) => {
      // TODO what kind of resource is this? should be possible with profile info of self link
      return new Resource(res, null, traversal);
    });
  }

  get() {
    return this.resource;
  }

  set(resource) {
    if (!resource) {
      throw new Error('Resource cannot be undefined.');
    }

    Object.assign(this.resource, resource);
    return this;
  }

  getProperty(property) {
    if (!property) {
      throw new Error('Property name cannot be undefined');
    }

    return this.resource[property];
  }

  setProperty(property, value) {
    this.dirty = true;
    this.resource[property] = value;
    return this;
  }
}
