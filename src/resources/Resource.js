import traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import halfred from 'halfred';
import validator from 'json-schema-remote';

import { del, get, put } from '../helper';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

export const resourceSymbol = Symbol('_resource');
export const environmentSymbol = Symbol('_environment');
export const traversalSymbol = Symbol('_traversal');

const dirtySymbol = Symbol('_dirty');
const resourceProperties = Symbol('resourceProperties');

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
  constructor(resource, environment = 'live', traversal) {
    this[environmentSymbol] = environment;
    this[dirtySymbol] = false;
    let r;
    if (resource instanceof halfred.Resource) {
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
      this[traversalSymbol] = traverson.from(this[resourceSymbol].link('self').href).jsonHal();
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

  countProperties() {
    this[resourceProperties] = Object.keys(this);
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
  newRequest() {
    if (typeof this[traversalSymbol].continue === 'function') {
      return this[traversalSymbol].continue().newRequest();
    }
    return this[traversalSymbol].newRequest();
  }

  /**
   * Reloads this {@link Resource}. Can be used when this resource was loaded from any {@link
    * ListResource} from _embedded.
   *
   * @returns {Promise<Resource>} this resource
   */
  resolve() {
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
   * Reset this {@link Resource} to its initial state. {@link Resource#isDirty} will be false
   * afterwards.
   *
   * @returns {undefined}
   */
  reset() {
    this[resourceSymbol] = halfred.parse(this[resourceSymbol].original());
    this[dirtySymbol] = false;
  }

  /**
   * Saves this {@link Resource}.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<Resource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(overwriteSchemaUrl) {
    const out = this.toOriginal();
    return validator.validate(out, overwriteSchemaUrl || this[resourceSymbol].link('self').profile)
    .then(() => put(this[environmentSymbol], this.newRequest().follow('self'), out))
    .then(([res, traversal]) => {
      this[resourceSymbol] = halfred.parse(res);
      this[traversalSymbol] = traversal;
      this[dirtySymbol] = false;
      return this;
    });
  }

  /**
   * Deletes this {@link Resource}.
   *
   * @returns {Promise<undefined>} Promise will resolve on success and reject otherwise.
   */
  del() {
    return del(this[environmentSymbol], this.newRequest().follow('self'));
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
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {object|null} the link with the given name or null.
   */
  getLink(link) {
    return this[resourceSymbol].link(link);
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {Array<object>|null} the link with the given name or null.
   */
  getLinks(link) {
    return this[resourceSymbol].linkArray(link);
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} of this
   * resource.
   *
   * @returns {object} object which has an array for each link.
   */
  allLinks() {
    return this[resourceSymbol].allLinks();
  }

  /**
   * @private
   *
   * @typedef {class} ResourceClass
   */

  /**
   * Loads the given {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link Resource} with the loaded result.
   *
   * @param {string} link the link name.
   * @param {class} ResourceClass override the default resource class ({@link Resource}).
   * @param {string?} name the name of the embedded resources
   * @param {object?} schema schema for {@link EntryResources}
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followLink(link, ResourceClass = Resource, name, schema) {
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
  get (properties) {
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
   * Will assign all properties in resource to this {@link Resource}.
   *
   * @param {object} resource object with properties to assign.
   * @returns {Resource} this Resource for chainability
   */
  set (resource) {
    if (!resource) {
      throw new Error('Resource cannot be undefined.');
    }

    Object.assign(this[resourceSymbol], resource);
    this[dirtySymbol] = true;
    return this;
  }

  /**
   * Will return a single selected property identified by property.
   *
   * @param {string} property the selected property name.
   * @returns {*} the property which was selected.
   */
  getProperty(property) {
    if (!property) {
      throw new Error('Property name cannot be undefined');
    }

    return this[resourceSymbol][property];
  }

  /**
   * Set a new value to the property identified by property.
   *
   * @param {string} property the property to change.
   * @param {any} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setProperty(property, value) {
    this[dirtySymbol] = true;
    this[resourceSymbol][property] = value;
    return this;
  }

  toOriginal() {
    const out = {};

    const keys = Object.keys(this);
    if (this[resourceProperties].length !== keys.length) {
      throw new Error(`Additional properties found: ${keys.filter(k => !this[resourceProperties].includes(k)).join(', ')}`);
    }

    Object.keys(this[resourceSymbol].original()).forEach((key) => {
      out[key] = this[resourceSymbol][key];
    });
    return out;
  }
}
