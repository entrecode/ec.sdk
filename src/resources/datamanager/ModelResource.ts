import Resource from '../Resource';
import { environment } from '../../Core';
import { del, post } from '../../helper';

const environmentSymbol = Symbol.for('environment');

interface ModelResource {
  created: Date,
  description: string,
  fields: Array<any>,
  hasEntries: boolean,
  hexColor: string,
  hooks: Array<any>,
  locales: Array<string>,
  modelID: string,
  modified: Date,
  policies: Array<any>,
  title: string,
  titleField: string,
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
        get: () => <Array<any>> this.getProperty('fields'),
        set: (value: Array<any>) => this.setProperty('fields', value)
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
    });
    this.countProperties();
  }

  /**
   * Start a purge for this model.
   *
   * @returns {Promise<void>} Returns a Promise resolving on accepted purge request.
   */
  purge() {
    return Promise.resolve()
    .then(() => this.newRequest().follow('ec:model/purge'))
    .then(request => del(this[environmentSymbol], request))
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
    .then(request => post(this[environmentSymbol], request))
    .then(([res]) => res);
  }
}

export default ModelResource;

/**
 * Single hook object.
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#hooks Hook Documentation}
 *
 * @typedef {{
 *  hookID: string,
 *  hook: string,
 *  type: string,
 *  description: string,
 *  methods: Array<string>,
 *  config: object
 * }} hook
 */

/**
 * Single condition object.
 *
 * @typedef {{
 *  field: string,
 *  operator: string,
 *  variable: string
 * }} condition
 */

/**
 * Multiple conditions can be used by putting them into an array.
 *
 * @typedef {(
 *  condition |
 *  Array<(conditions|condition|and|or)>
 * )} conditions
 */

/**
 * Policy object
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#permission-policies Policy Documentation}
 *
 * @typedef {{
 *  method: string,
 *  restrictToFields: Array<string>,
 *  public: boolean,
 *  roles: Array<string>,
 *  conditions: Array<conditions>
 * }} policy
 */

/**
 * Object describing all properties of fields.
 *
 * {@link https://doc.entrecode.de/en/latest/data_manager/#field-data-types Filed Documentation}
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
 * @typedef {{
 *  title: string,
 *  description: string,
 *  type: string,
 *  readOnly: boolean,
 *  required: boolean,
 *  unique: boolean,
 *  localizable: boolean,
 *  mutable: boolean,
 *  validation: (string|object)
 * }} field
 */
