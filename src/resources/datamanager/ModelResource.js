import Resource from '../Resource';

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
export default class ModelResource extends Resource {
  /**
   * Creates a new {@link ModelResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      modelID: {
        enumerable: true,
        get: () => this.getProperty('modelID'),
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
      fields: {
        enumerable: true,
        get: () => this.getProperty('fields'),
        set: (value) => {
          this.setProperty('fields', value);
          return value;
        },
      },
      hasEntries: {
        enumerable: true,
        get: () => this.getProperty('hasEntries'),
      },
      hexColor: {
        enumerable: true,
        get: () => this.getProperty('hexColor'),
        set: (value) => {
          this.setProperty('hexColor', value);
          return value;
        },
      },
      hooks: {
        enumerable: true,
        get: () => this.getProperty('hooks'),
        set: (value) => {
          this.setProperty('hooks', value);
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
      modified: {
        enumerable: true,
        get: () => new Date(this.getProperty('modified')),
      },
      policies: {
        enumerable: true,
        get: () => this.getProperty('policies'),
        set: (value) => {
          this.setProperty('policies', value);
          return value;
        },
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
      titleField: {
        enumerable: true,
        get: () => this.getProperty('titleField'),
        set: (value) => {
          this.setProperty('titleField', value);
          return value;
        },
      },
    });
  }
}

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
