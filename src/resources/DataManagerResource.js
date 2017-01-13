'use strict';

import Resource from './Resource';

export default class DataManagerResource extends Resource {
  setTitle(value) {
    if (!value) {
      throw new Error('Title must be defined');
    }

    this.setProperty('title', value);
  }

  getTitle() {
    return this.getProperty('title');
  }

  setDescription(value) {
    if (!value) {
      throw new Error('Description must be defined');
    }

    this.setProperty('description', value);
  }

  getDescription() {
    return this.getProperty('description');
  }

  setConfig(value) {
    if (!value) {
      throw new Error('Config must be defined');
    }

    this.setProperty('config', value);
  }

  getConfig() {
    return this.getProperty('config');
  }

  setHexColor(value) {
    if (!value) {
      throw new Error('HexColor must be defined');
    }

    this.setProperty('hexColor', value);
  }

  getHexColor() {
    return this.getProperty('hexColor');
  }

  setLocales(value) {
    if (!value || !Array.isArray(value)) {
      throw new Error('locales must be defined and an array');
    }

    this.setProperty('locales', value);
  }

  getLocales() {
    return this.getProperty('locales');
  }
}
