import * as HalAdapter from 'traverson-hal';
import * as halfred from 'halfred';
import * as traverson from 'traverson';
import * as validator from 'json-schema-remote';

import ListResource from './ListResource';
import { del, get, put } from '../helper';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');
const traversalSymbol = Symbol.for('traversal');
const dirtySymbol = Symbol('dirty');
const resourcePropertiesSymbol = Symbol('resourceProperties');

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);
validator.setLoggingFunction(() => {
});

/**
 * Generic resource class. Represents {@link https://tools.ietf.org/html/draft-kelly-json-hal-08
 * HAL resources}.
 *
 * @class
 * @access protected
 *
 * @prop {boolean}  isDirty   - Whether or not this Resource was modified
 */
export default class Resource {
  /**
   * Creates a new {@link Resource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment = 'live', traversal, name?: string, schema?: any) {
    this[environmentSymbol] = environment;
    this[dirtySymbol] = false;
    let r;
    if (resource instanceof halfred['Resource']) {
      r = resource.original();
    } else {
      r = resource;
    }
    this[resourceSymbol] = halfred.parse(JSON.parse(JSON.stringify(r)));

    if (typeof this[environmentSymbol] !== 'string') {
      throw new Error('environment must be a string');
    }

    if (traversal) {
      this[traversalSymbol] = traversal;
    } else {
      this[traversalSymbol] = traverson.from(this.getLink('self').href).jsonHal();
    }

    Object.defineProperties(this, {
      isDirty: {
        enumerable: false,
        get: () => this[dirtySymbol],
      },
      dirty: {
        enumerable: false,
      },
      resource: {
        enumerable: false,
      },
      traversal: {
        enumerable: false,
      },
    });
    this.countProperties();
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} of this
   * resource.
   *
   * @returns {object} object which has an array for each link.
   */
  allLinks(): { [key: string]: Array<any> } {
    return this[resourceSymbol].allLinks();
  }

  countProperties(): void {
    this[resourcePropertiesSymbol] = Object.keys(this);
  }

  /**
   * Deletes this {@link Resource}.
   *
   * @returns {Promise<undefined>} Promise will resolve on success and reject otherwise.
   */
  del(): Promise<void> {
    return del(this[environmentSymbol], this.newRequest().follow('self'));
  }

  /**
   * Loads the given {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link Resource} with the loaded result.
   *
   * @param {string} link the link name.
   * @param {ResourceClass} ResourceClass override the default resource class ({@link Resource}).
   * @param {string?} name the name of the embedded resources
   * @param {object?} schema schema for {@link EntryResource}s
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followLink(link: string, ResourceClass = Resource, name: string, schema: any): Promise<Resource> {
    return get(this[environmentSymbol], this.newRequest().follow(link))
    .then(([res, traversal]) => {
      return new ResourceClass(res, this[environmentSymbol], traversal, name, schema);
    });
  }

  /**
   * Returns an object with selected properties of the {@link Resource}. Will return all properties
   * when properties array is empty or undefined.
   *
   * @param {array<string>} properties array of properties to select.
   * @returns {object} object containing selected properties.
   */
  getAll(properties: Array<string>): any {
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return Object.assign({}, this[resourceSymbol]);
    }
    const out = {};
    properties.forEach((property) => {
      out[property] = this.getProperty(property);
    });
    return out;
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {object|null} the link with the given name or null.
   */
  getLink(link: string): any {
    return this[resourceSymbol].link(link);
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {Array<object>|null} the link with the given name or null.
   */
  getLinks(link: string): Array<any> {
    return this[resourceSymbol].linkArray(link);
  }

  /**
   * Will return a single selected property identified by property.
   *
   * @param {string} property the selected property name.
   * @returns {*} the property which was selected.
   */
  getProperty(property: string): any {
    if (!property) {
      throw new Error('Property name cannot be undefined');
    }

    return this[resourceSymbol][property];
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the given name.
   *
   * @param {string} link the link name.
   * @returns {boolean} whether or not a link with the given name was found.
   */
  hasLink(link) {
    return this[resourceSymbol].link(link) !== null;
  }

  /**
   * Creates a new {@link
    * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}
   *  which can be used for a new request to the API.
   *
   * @access private
   *
   * @returns {Object} traverson request builder instance.
   */
  newRequest(): any {
    if (typeof this[traversalSymbol].continue === 'function') {
      return this[traversalSymbol].continue().newRequest();
    }
    return this[traversalSymbol].newRequest();
  }

  /**
   * @private
   *
   * @typedef {function} ResourceClass
   * @constructor
   */

  /**
   * Reset this {@link Resource} to its initial state. {@link Resource#isDirty} will be false
   * afterwards.
   *
   * @returns {undefined}
   */
  reset(): void {
    this[resourceSymbol] = halfred.parse(this[resourceSymbol].original());
    this[dirtySymbol] = false;
  }

  /**
   * Reloads this {@link Resource}. Can be used when this resource was loaded from any {@link
    * ListResource} from _embedded.
   *
   * @returns {Promise<Resource>} this resource
   */
  resolve(): Promise<Resource> {
    return get(
      this[environmentSymbol],
      this.newRequest().follow('self')
    )
    .then(([res, traversal]) => {
      this[resourceSymbol] = halfred.parse(res);
      this[traversalSymbol] = traversal;
      this[dirtySymbol] = false;
      return this;
    });
  }

  /**
   * Saves this {@link Resource}.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<Resource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(overwriteSchemaUrl?: string): Promise<Resource> {
    return Promise.resolve()
    .then(() => {
      const out = this.toOriginal();
      // TODO dot notation
      return validator.validate(out, overwriteSchemaUrl || this.getLink('self').profile)
      .then(() => put(this[environmentSymbol], this.newRequest().follow('self'), out))
      .then(([res, traversal]) => {
        this[resourceSymbol] = halfred.parse(res);
        this[traversalSymbol] = traversal;
        this[dirtySymbol] = false;
        return this;
      });
    });
  }

  /**
   * Will assign all properties in resource to this {@link Resource}.
   *
   * @param {object} resource object with properties to assign.
   * @returns {Resource} this Resource for chainability
   */
  setAll(resource: any): any {
    if (!resource) {
      throw new Error('Resource cannot be undefined.');
    }

    Object.assign(this[resourceSymbol], resource);
    this[dirtySymbol] = true;
    return this;
  }

  /**
   * Set a new value to the property identified by property.
   *
   * @param {string} property the property to change.
   * @param {any} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setProperty(property: string, value: any): any {
    this[dirtySymbol] = true;
    this[resourceSymbol][property] = value;
    return this;
  }

  toOriginal(): any {
    const out = {};

    const keys = Object.keys(this);
    if (this[resourcePropertiesSymbol].length !== keys.length) {
      throw new Error(`Additional properties found: ${keys.filter(k => !this[resourcePropertiesSymbol].includes(k)).join(', ')}`);
    }

    Object.keys(this[resourceSymbol].original()).forEach((key) => {
      out[key] = this[resourceSymbol][key];
    });
    return out;
  }
}
