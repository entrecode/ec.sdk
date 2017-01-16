'use strict';

import Resource from './Resource';

export default class ListResource extends Resource {
  constructor(resource, name, traversal) {
    super(resource, name, traversal);
    this.ListClass = ListResource;
    this.ItemClass = Resource;
  }

  getAllItems() {
    const array = this.resource.embeddedArray(this.name) || [];
    return array.map(resource => new this.ItemClass(resource));
  }

  getItem(n) {
    if (n === undefined) { // undefined check
      throw new Error('Index must be defined.');
    }
    const array = this.resource.embeddedArray(this.name);
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list.');
    }
    return new this.ItemClass(array[n]);
  }

  getFirstItem() {
    return this.getItem(0);
  }

  hasFirstLink() {
    return this.hasLink('first');
  }

  followFirstLink() {
    // TODO convert to list resouce
    return this.followLink('first', this.ListClass);
  }

  hasNextLink() {
    return this.hasLink('next');
  }

  followNextLink() {
    // TODO convert to list resouce
    return this.followLink('next', this.ListClass);
  }

  hasPrevLink() {
    return this.hasLink('prev');
  }

  followPrevLink() {
    // TODO convert to list resouce
    return this.followLink('prev', this.ListClass);
  }
}
