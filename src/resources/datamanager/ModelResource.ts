import * as validator from 'json-schema-remote';
import Resource from '../Resource';
import { environment } from '../../types';
import { get, del, post, optionsToQuery } from '../../helper';
import { FilterOptions } from '../ListResource';
import HistoryEvents from '../publicAPI/HistoryEvents';

const environmentSymbol: any = Symbol.for('environment');

interface ModelResource {
  created: Date;
  description: string;
  fields: Array<any>;
  hasEntries: boolean;
  hexColor: string;
  hooks: Array<any>;
  locales: Array<string>;
  modelID: string;
  modified: Date;
  policies: Array<any>;
  title: string;
  titleField: string;
  config: any;
}

/**
 * Model resource class
 *
 * @class
 *
 * @prop {string}         modelID       - The id of this Model
 * @prop {Date}           created       - The Date on which this Model was created
 * @prop {string}         description   - optional description
 * @prop {Array<field>}   fields        - Array of fields
 * @prop {boolean}        hasEntries    - Whether or not this Model has Entries
 * @prop {string}         hexColor      - The hexColor for frontend usage
 * @prop {Array<hook>}    hooks         - Array of hooks
 * @prop {Array<string>}  locales       - Array of available locales
 * @prop {Date}           modified      - The Date this Model was modified last
 * @prop {Array<policy>}  policies      - Array of Policies
 * @prop {string}         title         - Model title
 * @prop {string}         titleField    - the field to used as a title for Entries
 * @prop {any}            config        - the config for this model
 */
class ModelResource extends Resource {
  /**
   * Creates a new {@link ModelResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      description: {
        enumerable: true,
        get: () => <string>this.getProperty('description'),
        set: (value: string) => this.setProperty('description', value),
      },
      fields: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('fields'),
        set: (value: Array<any>) => this.setProperty('fields', value),
      },
      hasEntries: {
        enumerable: true,
        get: () => <boolean>this.getProperty('hasEntries'),
      },
      hexColor: {
        enumerable: true,
        get: () => <string>this.getProperty('hexColor'),
        set: (value: string) => this.setProperty('hexColor', value),
      },
      hooks: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('hooks'),
        set: (value: Array<any>) => this.setProperty('hooks', value),
      },
      locales: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('locales'),
        set: (value: Array<string>) => this.setProperty('locales', value),
      },
      modelID: {
        enumerable: true,
        get: () => <string>this.getProperty('modelID'),
      },
      modified: {
        enumerable: true,
        get: () => new Date(this.getProperty('modified')),
      },
      policies: {
        enumerable: true,
        get: () => this.getProperty('policies'),
        set: (value: any) => this.setProperty('policies', value),
      },
      title: {
        enumerable: true,
        get: () => <string>this.getProperty('title'),
        set: (value: string) => this.setProperty('title', value),
      },
      titleField: {
        enumerable: true,
        get: () => <string>this.getProperty('titleField'),
        set: (value: string) => this.setProperty('titleField', value),
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value: any) => this.setProperty('config', value),
      },
    });
    this.countProperties();
  }

  /**
   * Load the HistoryEvents for this Model from v3 API.
   *
   * @param {filterOptions | any} options The filter options
   * @returns {Promise<HistoryEvents} The filtered HistoryEvents
   */
  getEvents(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/history'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new HistoryEvents(res, this[environmentSymbol], traversal));
  }

  /*
  /**
   * Creates a new History EventSource with the given filter options.
   *
   * @deprecated
   * 
   * @param {filterOptions | any} options The filter options
   * @return {Promise<EventSource>} The created EventSource.
   */
  /*
  newHistory(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return getHistory(this[environmentSymbol], request);
      });
  }

  /**
   * Creates a new HistoryEventsResource with past events.
   *
   * @deprecated
   * 
   * @param {filterOptions?} options The filter options.
   * @returns {Promise<HistoryEventsResource} Event list of past events.
   */
  /*
  getPastEvents(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res]) => new HistoryEvents(res, this[environmentSymbol]));
  }
  */

  /**
   * Saves this {@link Resource}.
   *
   * @param {boolean} safePut true when safe put functionality is required.
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<Resource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false, overwriteSchemaUrl?: string): Promise<Resource> {
    return Promise.resolve().then(() => {
      validator.dropSchemas();
      return super.save(safePut, overwriteSchemaUrl);
    });
  }

  /**
   * Start a purge for this model.
   *
   * @returns {Promise<void>} Returns a Promise resolving on accepted purge request.
   */
  purge() {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/purge'))
      .then((request) => del(this[environmentSymbol], request))
      .then(() => undefined);
  }

  /**
   * Start a sync for models with sync settings.
   *
   * @returns {Promise<any>} Returns a Promise resolving to sync result.
   */
  sync() {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/sync'))
      .then((request) => post(this[environmentSymbol], request))
      .then(([res]) => res);
  }
}

export default ModelResource;

/**
 * Single hook object.
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#hooks Hook Documentation}
 *
 * @typedef {Object} hook
 * @property {string} hookID
 * @property {string} hook
 * @property {string} type
 * @property {string} description
 * @property {Array<string>} methods
 * @property {Object} config
 */

/**
 * Single condition object.
 *
 * @typedef {Object} condition
 * @property {string} field
 * @property {string} operator
 * @property {string} variable
 */

/**
 * Multiple conditions can be used by putting them into an array.
 *
 * @typedef {condition|Array<condition|conditions|string>} conditions String can be 'and' or 'or'.
 */

/**
 * Policy object
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#permission-policies Policy Documentation}
 *
 * @typedef {Object} policy
 * @property {string} method
 * @property {Array<string>} restrictToFields
 * @property {boolean} public
 * @property {Array<string>} roles
 * @property {Array<conditions>} conditions
 */

/**
 * Object describing all properties of fields.
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#field-data-types Field Documentation}
 *
 * @example
 * {
 *   "method": "put",
 *   "restrictToFields": ["editableField"],
 *   "public": false,
 *   "roles": ["anonymous"],
 *   "conditions": [
 *     {
 *       "field": "_creator",
 *       "operator": "=",
 *       "variable": "accountID"
 *     },
 *     "or",
 *     {
 *       "field": "public",
 *       "operator": "=",
 *       "constant":true
 *     }
 *   ]
 * }
 *
 * @typedef {Object} field
 * @property {string} title
 * @property {string} description
 * @property {string} type
 * @property {boolean} readOnly
 * @property {boolean} required
 * @property {boolean} unique
 * @property {boolean} localizable
 * @property {boolean} mutable
 * @property {string|object} validation
 */
