import Resource from '../Resource';
import { environment } from '../../Core';
import { post } from '../../helper';

const environmentSymbol = Symbol.for('environment');

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this.countProperties();
  }

  get created() {
    return new Date(this.getProperty('created'))
  }

  get description() {
    return <string>this.getProperty('description')
  }

  set description(value: string) {
    this.setProperty('description', value);
  }

  get fields() {
    return <Array<any>>this.getProperty('fields');
  }

  set fields(value: Array<string>) {
    this.setProperty('fields', value);
  }

  get hasEntries() {
    return <boolean>this.getProperty('hasEntries');
  }

  get hexColor() {
    return <string>this.getProperty('hexColor');
  }

  set hexColor(value: string) {
    this.setProperty('hexColor', value);
  }

  get hooks() {
    return <Array<any>>this.getProperty('hooks');
  }

  set hooks(value: Array<any>) {
    this.setProperty('hooks', value);
  }

  get locales() {
    return <Array<string>>this.getProperty('locales');
  }

  set locales(value: Array<string>) {
    this.setProperty('locales', value);
  }

  get modelID() {
    return <string>this.getProperty('modelID');
  }

  get modified() {
    return new Date(this.getProperty('modified'));
  }

  get policies() {
    return this.getProperty('policies');
  }

  set policies(value) {
    this.setProperty('policies', value);
  }

  get title() {
    return <string>this.getProperty('title');
  }

  set title(value: string) {
    this.setProperty('title', value);
  }

  get titleField() {
    return <string>this.getProperty('titleField');
  }

  set titleField(value: string) {
    this.setProperty('titleField', value);
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
