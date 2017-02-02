import * as traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import halfred from 'halfred';
import { get, put, del } from '../helper';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

/**
 * @private
 * @typedef {class} ResourceClass
 */

/**
 * Generic resource class. Represents {@link https://tools.ietf.org/html/draft-kelly-json-hal-08
 * HAL resources}.
 * @class
 */
export default class Resource {
  /**
   * Creates a new {@link Resource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    this.environment = environment || 'live';
    this.dirty = false;
    this.resource = halfred.parse(JSON.parse(JSON.stringify(resource)));

    if (traversal) {
      this.traversal = traversal;
    } else {
      this.traversal = traverson.from(this.resource.link('self').href).jsonHal()
      .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
    }
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
    if ({}.hasOwnProperty.call(this.traversal, 'continue')) {
      return this.traversal.continue().newRequest();
    }
    return this.traversal.newRequest();
  }

  /**
   * Check if this {@link Resource} was modified since loading.
   *
   * @returns {boolean} whether or not this Resource was modified
   */
  isDirty() {
    return this.dirty;
  }

  /**
   * Reset this {@link Resource} to its initial state. {@link Resource#isDirty} will be false
   * afterwards.
   *
   * @returns {undefined}
   */
  reset() {
    this.resource = halfred.parse(this.resource.original());
    this.dirty = false;
  }

  /**
   * Saves this {@link Resource}.
   *
   * @returns {Promise<Resource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save() {
    // TODO add validation
    return put(
      this.environment,
      this.newRequest().follow('self'),
      // TODO does this Object.assign work how I want it to?
      // or do we need for(key in obj) loop?
      Object.assign(this.resource.original(), this.resource)
    )
    .then(([res, traversal]) => {
      this.resource = halfred.parse(res);
      this.traversal = traversal;
      this.dirty = false;
      return this;
    });
  }

  /**
   * Deletes this {@link Resource}.
   *
   * @returns {Promise<undefined>} Promise will resolve on success and reject otherwise.
   */
  del() {
    return del(this.environment, this.newRequest().follow('self'));
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
    return this.resource.link(link) !== null;
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {object|null} the link with the given name or null.
   */
  getLink(link) {
    return this.resource.link(link);
  }

  /**
   * Loads the given {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link Resource} with the loaded result.
   *
   * @param {string} link the link name.
   * @param {class} ResourceClass override the default resource class ({@link Resource}).
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followLink(link, ResourceClass) {
    return get(this.environment, this.newRequest().follow(link))
    .then(([res, traversal]) => {
      if (ResourceClass) {
        return new ResourceClass(res, null, traversal);
      }
      return new Resource(res, traversal);
    });
  }

  // TODO follow all?

  /**
   * Returns an object with selected properties of the {@link Resource}. Will return all properties
   * when properties array is empty or undefined.
   *
   * @param {array<string>} properties array of properties to select.
   * @returns {object} object containing selected properties.
   */
  get(properties) {
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return Object.assign({}, this.resource);
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
  set(resource) {
    if (!resource) {
      throw new Error('Resource cannot be undefined.');
    }

    Object.assign(this.resource, resource);
    this.dirty = true;
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

    return this.resource[property];
  }

  /**
   * Set a new value to the property identified by property.
   * @param {string} property the property to change.
   * @param {any} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setProperty(property, value) {
    this.dirty = true;
    this.resource[property] = value;
    return this;
  }
}
