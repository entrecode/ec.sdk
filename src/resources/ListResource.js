import Resource, { environmentSymbol, resourceSymbol } from './Resource';

const nameSymbol = Symbol('_name');
const listClassSymbol = Symbol('_listClass');
const itemClassSymbol = Symbol('_itemClass');
const itemSchemaSymbol = Symbol('_itmeSchema');

/**
 * Generic list resource class. Represents {@link
  * https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL resources} with added support for lists.
 *
 * @class
 *
 * @prop {number} count - the number of embedded items in this list
 * @prop {number} size - the number of total items in this list
 */
export default class ListResource extends Resource {
  /**
   * Creates a new {@link ListResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   * @param {?string} name name of the embedded resources.
   * @param {object?} itemSchema optional schema for list items
   * @param {ListResource} ListClass Class constructor for list types
   * @param {Resource} ItemClass Class constructor for item types
   */
  constructor(resource, environment, traversal, name, itemSchema, ListClass = ListResource, ItemClass = Resource) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      count: {
        enumerable: false,
        get: () => this.getProperty('count'),
      },
      total: {
        enumerable: false,
        get: () => this.getProperty('total'),
      },
    });

    this[listClassSymbol] = ListClass;
    this[itemClassSymbol] = ItemClass;
    this[itemSchemaSymbol] = itemSchema;
    this[nameSymbol] = name || Object.keys(this[resourceSymbol].allEmbeddedResources())[0];
  }

  /**
   * Get all list items {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} into this {@link ListResource}.
   *
   * @returns {Array<Resource|ResourceClass>} an array of all list items.
   */
  getAllItems() {
    const array = this[resourceSymbol].embeddedArray(this[nameSymbol]) || [];
    return array.map((resource) => {
      if (this[itemSchemaSymbol]) {
        return new this[itemClassSymbol](resource, this[environmentSymbol], this[itemSchemaSymbol]);
      }
      return new this[itemClassSymbol](resource, this[environmentSymbol]);
    });
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
    const array = this[resourceSymbol].embeddedArray(this[nameSymbol]);
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list.');
    }
    if (array.length <= n) {
      throw new Error(`Cannot get ${n}'th item of list with length ${array.length}`);
    }

    if (this[itemSchemaSymbol]) {
      return new this[itemClassSymbol](array[n], this[environmentSymbol], this[itemSchemaSymbol]);
    }
    return new this[itemClassSymbol](array[n], this[environmentSymbol]);
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
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followFirstLink() {
    return this.followLink('first', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
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
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followNextLink() {
    return this.followLink('next', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
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
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followPrevLink() {
    return this.followLink('prev', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
  }
}

/**
 * List filter options with pagination, sorting, and {@link filter}. This can be used to apply all
 * sorts of filter to a list request.
 *
 * @example
 * accounts.accountList({ size: 25 }); // will result in a list with 25 entries
 * accounts.accountList({
 *   sort: ['email', '-created'], // sorted by email asc and created desc
 *   page: 3, // page 3 of a list with 10 entries
 *   property: 'exactlyThis', // filter exactly exactlyThis for property property
 * });
 * // for filter see below
 *
 * @typedef {{size: number, page: number, sort: array<string>, property: filter}} filterOptions
 */

/**
 *
 * {@link filterOptions} can contain key value pairs with filter options. These object will be
 * applied when loading a {@link ListResource}.
 *
 * @example
 * accounts.accountList({
 *   email: {
 *     search: 'andre', // email contains 'andre'
 *   },
 *   language: 'de', // language is exactly 'de'
 *   active: {
 *     exactly: 'active', // is (exactly) in active state
 *   },
 *   created: {
 *     from: new Date(new Date().getTime() - 60000), // created 10minutes or less ago
 *   },
 *   permissions: { // has at least one of these permissions
 *     any: [
 *       'dm-user',
 *       'app-user',
 *     ],
 *   },
  * });
 *
 * @typedef {{propertyName: (string|{exact: string, search: string, from: string, to: string, any:
 *   array<string>, all: array<string>})}} filter
 */

/**
 * @typedef {class} ListResourceClass
 * @access private
 */

/**
 * @typedef {class} ResourceClass
 * @access private
 */
