'use strict';

import Resource from './Resource';

export default class ListResource extends Resource {
  getAllItems() {
    const array = this.resource.embeddedArray(this.name) || [];
    // TODO what kind of resource is this?
    // TODO create resource objects when receiving the list
    return array.map(resource => new Resource(resource));
  }

  getItem(n) {
    if (n === undefined) { // undefined check
      throw new Error('Index must be defined.');
    }
    const array = this.resource.embeddedArray(this.name);
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list.');
    }
    // TODO what kind of resources is this?
    // maybe this could be done with a this.ResourceClass/this.ListClass property
    // those properties could be set by the Object inherited from Core?

    // TODO create resource objects when receiving the list
    return new Resource(array[n]);
  }

  getFirstItem() {
    return this.getItem(0);
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
