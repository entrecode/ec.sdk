'use strict';

import Resource from './Resource';

/**
 * @private
 * @typedef {class} ListResourceClass
 */
/**
 * @private
 * @typedef {class} ResourceClass
 */

/**
 * Generic list resource class. Represents {@link
  * https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL resources} with added support for lists.
 * @class
 */
export default class ListResource extends Resource {
  /**
   * Creates a new {@link ListResource}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {?string} name name of the embedded resources.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, name, traversal) {
    super(resource, traversal);

    /**
     * Defines the class this {@link ListResource} has. Is used to support more specified classes
     * like {@link DataManagerList}.
     *
     * @type {ListResource|ListResourceClass}
     */
    this.ListClass = ListResource;

    /**
     * Defines the class the items of this {@link ListResource} have.
     * @type {Resource|ResourceClass}
     */
    this.ItemClass = Resource;
    this.name = name || Object.keys(this.resource.allEmbeddedResources())[0];
  }

  /**
   * Get all list items {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} into this {@link ListResource}.
   *
   * @returns {Array<Resource|ResourceClass>} an array of all list items.
   */
  getAllItems() {
    const array = this.resource.embeddedArray(this.name) || [];
    return array.map(resource => new this.ItemClass(resource));
  }

  /**
   * Get the n'th {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @param {number} n index of the item
   * @returns {Resource|ResourceClass} the requested item.
   */
  getItem(n) {
    if (n === undefined) { // undefined check
      throw new Error('Index must be defined.');
    }
    const array = this.resource.embeddedArray(this.name);
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list.');
    }
    return new this.ItemClass(array[n]);
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @returns {Resource|ResourceClass} the first item.
   */
  getFirstItem() {
    return this.getItem(0);
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'first'.
   *
   * @returns {boolean} whether or not a link with the name 'first' was found.
   */
  hasFirstLink() {
    return this.hasLink('first');
  }

  /**
   * Loads the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise.<Resource|ResourceClass>} the resource identified by the link.
   */
  followFirstLink() {
    // TODO convert to list resouce
    return this.followLink('first', this.ListClass);
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'next'.
   *
   * @returns {boolean} whether or not a link with the name 'next' was found.
   */
  hasNextLink() {
    return this.hasLink('next');
  }

  /**
   * Loads the next {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise.<Resource|ResourceClass>} the resource identified by the link.
   */
  followNextLink() {
    // TODO convert to list resouce
    return this.followLink('next', this.ListClass);
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'prev'.
   *
   * @returns {boolean} whether or not a link with the name 'prev' was found.
   */
  hasPrevLink() {
    return this.hasLink('prev');
  }

  /**
   * Loads the prev {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise.<Resource|ResourceClass>} the resource identified by the link.
   */
  followPrevLink() {
    // TODO convert to list resouce
    return this.followLink('prev', this.ListClass);
  }
}
