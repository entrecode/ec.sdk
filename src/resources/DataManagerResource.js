import { get } from '../helper';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import Resource from './Resource';

/**
 * DataManager resource class.
 *
 * @class
 */
export default class DataManagerResource extends Resource {
  /**
   * Load a {@link ModelList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {{size: number, page: number, sort: array<string>, filter: filter}} options the
   *   filter options.
   * @returns {Promise<ModelList>} resolves to model list with applied filters.
   */
  modelList(options) {
    const o = {};
    if (options) {
      Object.assign(o, options);
    }

    o.dataManagerID = this.getDataManagerID();

    if (Object.keys(o).length === 2 &&
      {}.hasOwnProperty.call(o, 'dataManagerID') && {}.hasOwnProperty.call(o, 'modelID')) {
      throw new Error('Cannot filter modelList only by dataManagerID and modelID. Use #model(modelID) instead.');
    }

    return get(
      this.environment,
      this.newRequest().follow('ec:models/options').withTemplateParameters(o)
    )
    .then(([resource, traversal]) => new ModelList(resource, this.environment, traversal));
  }

  /**
   * Get a single {@link ModelResource} identified by modelID.
   *
   * @param {string} modelID id of the Model.
   * @returns {Promise<ModelResource>} resolves to the Model which should be loaded.
   */
  model(modelID) {
    if (!modelID) {
      throw new Error('modelID must be defined');
    }

    return get(
      this.environment,
      this.newRequest().follow('ec:models/options').withTemplateParameters({ modelID })
    )
    .then(([resource, traversal]) => new ModelResource(resource, this.environment, traversal));
  }

  /**
   * Will return created getDataManagerID.
   *
   * @returns {Date} the getDataManagerID.
   */
  getDataManagerID() {
    return this.getProperty('dataManagerID');
  }

  /**
   * Will return created property.
   *
   * @returns {Date} the create date.
   */
  getCreated() {
    return new Date(this.getProperty('created'));
  }

  /**
   * Set a new value to title property.
   * @param {string} value the value to assign.
   * @returns {DataManagerResource} this Resource for chainability
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
   * @returns {DataManagerResource} this Resource for chainability
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
   * @returns {DataManagerResource} this Resource for chainability
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
   * @returns {DataManagerResource} this Resource for chainability
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
   * @returns {DataManagerResource} this Resource for chainability
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
