'use strict';

import Resource from './Resource';
import {put} from '../Core';

export default class ListResource extends Resource {
  getAllItems() {
    const array = this.resource.embeddedArray(this.name) || [];
    // TODO what kind of resource is this?
    // TODO create resource objects when receiving the list
    array.map(resource => new Resource(resource));
    return array;
  }

  getItem(n) {
    const array = this.resource.embeddedArray(this.name);
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list');
    }
    // TODO what kind of resources is this?
    // TODO create resource objects when receiving the list
    return new Resource(array[n]);
  }

  getFirstItem() {
    return this.getItem(0);
  }

  create(item) {
    if (!item) {
      throw new Error('Cannot create resource with undefined object.');
    }
    // TODO schema validation
    return put(this.newRequest().follow('self'), item);
  }

  hasFirstLink() {
    return this.hasLink('first');
  }

  followFirstLink() {
    // TODO convert to list resouce
    return this.followLink('first');
  }

  hasNextLink() {
    return this.hasLink('next');
  }

  followNextLink() {
    // TODO convert to list resouce
    return this.followLink('next');
  }

  hasPrevLink() {
    return this.hasLink('prev');
  }

  followPrevLink() {
    // TODO convert to list resouce
    return this.followLink('prev');
  }
}
