import Resource from './Resource';

/**
 * Model resource class
 *
 * @class
 */
export default class ModelResource extends Resource {
  setDescription(value) {
    if (!value) {
      throw new Error('description must be defined');
    }

    this.setProperty('description', value);
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
   * Set a new value to fields property.
   *
   * @param {Array<object>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setFields(value) {
    if (!value) {
      throw new Error('fields must be defined');
    }

    return this.setProperty('fields', value);
  }

  /**
   * Will return fields property.
   *
   * @returns {Array<string>} the fields.
   */
  getFields() {
    return this.getProperty('fields');
  }

  /**
   * Set a new value to hexColor property.
   *
   * @param {string} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setHexColor(value) {
    if (!value) {
      throw new Error('hexColor must be defined');
    }

    return this.setProperty('hexColor', value);
  }

  /**
   * Will return hexColor property.
   *
   * @returns {string} the hexColor.
   */
  getHexColor() {
    return this.getProperty('hexColor');
  }

  /**
   * Set a new value to hooks property.
   *
   * @param {Array<object>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setHooks(value) {
    if (!value) {
      throw new Error('hooks must be defined');
    }

    return this.setProperty('hooks', value);
  }

  /**
   * Will return hooks property.
   *
   * @returns {Array<Object>} the hooks.
   */
  getHooks() {
    return this.getProperty('hooks');
  }

  /**
   * Set a new value to locales property.
   *
   * @param {Array<string>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setLocales(value) {
    if (!value) {
      throw new Error('locales must be defined');
    }

    return this.setProperty('locales', value);
  }

  /**
   * Will return locales property.
   *
   * @returns {Array<string>} the locales.
   */
  getLocales() {
    return this.getProperty('locales');
  }

  /**
   * Set a new value to policies property.
   *
   * @param {Array<object>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setPolicies(value) {
    if (!value) {
      throw new Error('policies must be defined');
    }

    return this.setProperty('policies', value);
  }

  /**
   * Will return policies property.
   *
   * @returns {Array<Object>} the policies.
   */
  getPolicies() {
    return this.getProperty('policies');
  }

  /**
   * Set a new value to title property.
   *
   * @param {string} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setTitle(value) {
    if (!value) {
      throw new Error('title must be defined');
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
   * Set a new value to titleField property.
   *
   * @param {string} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setTitleField(value) {
    if (!value) {
      throw new Error('titleField must be defined');
    }

    return this.setProperty('titleField', value);
  }

  /**
   * Will return titleField property.
   *
   * @returns {string} the titleField.
   */
  getTitleField() {
    return this.getProperty('titleField');
  }

  /**
   * Will return created property.
   *
   * @returns {Date} the created.
   */
  getCreated() {
    return new Date(this.getProperty('created'));
  }

  /**
   * Will return created property.
   *
   * @returns {string} the created.
   */
  getModelID() {
    return this.getProperty('modelID');
  }

  /**
   * Will return modified property.
   *
   * @returns {Date} the modified.
   */
  getModified() {
    return new Date(this.getProperty('modified'));
  }

  /**
   * Will return true when this model has entries.
   *
   * @returns {boolean} whether or not the model has entries.
   */
  hasEntries() {
    return this.getProperty('hasEntries');
  }
}
