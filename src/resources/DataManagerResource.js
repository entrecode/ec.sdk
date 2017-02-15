import { get } from '../helper';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import Resource from './Resource';

/**
 * DataManager resource class.
 *
 * @class
 *
 * @prop {string}         dataManagerID   - The id of the dataManager
 * @prop {object}         config          - The dataManager config
 * @prop {Date}           created         - The Date this dataManager was created
 * @prop {string}         description     - The description
 * @prop {string}         hexColor        - The hexColor for frontend usage
 * @prop {Array<string>}  locales         - Array of available locales
 * @prop {string}         shortID         - Shortened {@link DataManager#dataManagerID}
 * @prop {string}         title           - Title of the dataManager
 */
export default class DataManagerResource extends Resource {
  /**
   * Creates a new {@link DataManagerResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      dataManagerID: {
        enumerable: true,
        get: () => this.getProperty('dataManagerID'),
      },

      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      description: {
        enumerable: true,
        get: () => this.getProperty('description'),
        set: (value) => {
          this.setProperty('description', value);
          return value;
        },
      },
      hexColor: {
        enumerable: true,
        get: () => this.getProperty('hexColor'),
        set: (value) => {
          this.setProperty('hexColor', value);
          return value;
        },
      },
      locales: {
        enumerable: true,
        get: () => this.getProperty('locales'),
        set: (value) => {
          this.setProperty('locales', value);
          return value;
        },
      },
      shortID: {
        enumerable: true,
        get: () => this.getProperty('shortID'),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
    });
  }

  /**
   * Load a {@link ModelList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {{size: number, page: number, sort: array<string>, filter: filter}} options? the
   *   filter options.
   * @returns {Promise<ModelList>} resolves to model list with applied filters.
   */
  modelList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.getDataManagerID;

      if (Object.keys(o).length === 2 && 'dataManagerID' in o && 'modelID' in o) {
        throw new Error('Cannot filter modelList only by dataManagerID and modelID. Use DataManagerResource#model() instead.');
      }

      return get(
        this.environment,
        this.newRequest().follow('ec:models/options').withTemplateParameters(o)
      );
    })
    .then(([resource, traversal]) => new ModelList(resource, this.environment, traversal));
  }

  /**
   * Get a single {@link ModelResource} identified by modelID.
   *
   * @param {string} modelID id of the Model.
   * @returns {Promise<ModelResource>} resolves to the Model which should be loaded.
   */
  model(modelID) {
    return Promise.resolve()
    .then(() => {
      if (!modelID) {
        throw new Error('modelID must be defined');
      }

      return get(
        this.environment,
        this.newRequest().follow('ec:models/options').withTemplateParameters({ modelID })
      );
    })
    .then(([resource, traversal]) => new ModelResource(resource, this.environment, traversal));
  }
}
