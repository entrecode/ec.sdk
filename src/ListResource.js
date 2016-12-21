'use strict';

import Resource from './Resource';

export default class ListResource extends Resource {
  get(n) {
    this.resource.getEmbedded(n);
  }

  getFirst() {
    return this.get(0);
  }

  getSecond() {
    return this.get(1);
  }

  hasFirst() {
    return this.hasLink('first');
  }

  loadFirst() {
    return this.getLink('first');
  }

  hasNext() {
    return this.hasLink('next');
  }

  loadNext() {
    return this.getLink('next');
  }

  hasPrev() {
    return this.hasLink('prev');
  }

  loadPrev() {
    return this.getLink('prev');
  }
}
