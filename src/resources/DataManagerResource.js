'use strict';

import Resource from './Resource';

/**
 * DataManager resource class.
 *
 * @class
 */
export default class DataManagerResource extends Resource {
  /**
   * Set a new value to title property.
   * @param {string} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setTitle(value) {
    if (!value) {
      throw new Error('Title must be defined');
    }

    return this.setProperty('title', value);
  }

  /**
   * Will return title property.
   *
   * @returns {string} the title.
   */
  getTitle() {
    return this.getProperty('title');
  }

  /**
   * Set a new value to description property.
   * @param {string} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setDescription(value) {
    if (!value) {
      throw new Error('Description must be defined');
    }

    return this.setProperty('description', value);
  }

  /**
   * Will return description property.
   *
   * @returns {string} the description.
   */
  getDescription() {
    return this.getProperty('description');
  }

  /**
   * Set a new value to config property.
   * @param {object} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setConfig(value) {
    if (!value) {
      throw new Error('Config must be defined');
    }

    return this.setProperty('config', value);
  }

  /**
   * Will return config property.
   *
   * @returns {object} the config.
   */
  getConfig() {
    return this.getProperty('config');
  }

  /**
   * Set a new value to hexColor property.
   * @param {any} value the value to assign. Format '#ffffff'
   * @returns {Resource} this Resource for chainability
   */
  setHexColor(value) {
    if (!value) {
      throw new Error('HexColor must be defined');
    }

    return this.setProperty('hexColor', value);
  }

  /**
   * Will return hexColor property.
   *
   * @returns {object} the hexColor.
   */
  getHexColor() {
    return this.getProperty('hexColor');
  }

  /**
   * Set a new value to locales property.
   * @param {array<string>} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setLocales(value) {
    if (!value || !Array.isArray(value)) {
      throw new Error('locales must be defined and an array');
    }

    return this.setProperty('locales', value);
  }

  /**
   * Will return locales property.
   *
   * @returns {array<string>} the locales.
   */
  getLocales() {
    return this.getProperty('locales');
  }
}
