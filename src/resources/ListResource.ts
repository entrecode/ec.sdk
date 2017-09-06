import Resource from './Resource';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');
const itemClassSymbol = Symbol('_itemClass');
const itemSchemaSymbol = Symbol('_itmeSchema');
const listClassSymbol = Symbol('_listClass');
const nameSymbol = Symbol('_name');

function map(list: ListResource, iterator: (resource: Resource) => Promise<any> | any, results: Array<Resource> = []) {
  return list.getAllItems().map(entry =>
    res =>
      Promise.resolve()
      .then(() => iterator(entry))
      .then((result) => {
        res.push(result);
        return res;
      }))
  .reduce((current, next) => current.then(next), Promise.resolve(results))
  .then((res: Array<Resource>) => {
    if (!list.hasNextLink()) {
      return res;
    }
    return list.followNextLink()
    .then(next => map(next, iterator, res));
  });
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
 * @typedef {{size: number, page: number, sort: array<string>, _levels: number, _fields:
 *   Array<string>, property: filter}} filterOptions
 */

/**
 *
 * {@link filterOptions} can contain key value pairs with filter options for entry fields. These
 * object will be applied when loading a {@link ListResource}.
 *
 * @example
 * accounts.accountList({
 *   email: {
 *     search: 'andre', // email contains 'andre'
 *   },
 *   language: 'de', // language is exactly 'de'
 *   active: {
 *     exact: 'active', // is (exactly) in active state
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
 * Generic list resource class. Represents {@link
  * https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL resources} with added support for
 * lists.
 *
 * Since version 0.8.1 ListResources are iterable, so you can use spread operator or for … of loops
 * with them.
 *
 * @class
 *
 * @prop {number} count - the number of embedded items in this list
 * @prop {number} size - the number of total items in this list
 */
export default class ListResource extends Resource {
  private index: number = 0;

  /**
   * Creates a new {@link ListResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object} traversal traversal from which traverson can continue.
   * @param {string} name name of the embedded resources.
   * @param {object} itemSchema optional schema for list items
   * @param {ListResource} ListClass Class constructor for list types
   * @param {Resource} ItemClass Class constructor for item types
   */
  constructor(resource: any, environment: string, traversal: any, name: string, itemSchema: any, ListClass = ListResource, ItemClass = Resource) {
    super(resource, environment, traversal);

    this[listClassSymbol] = ListClass;
    this[itemClassSymbol] = ItemClass;
    this[itemSchemaSymbol] = itemSchema;
    this[nameSymbol] = name || Object.keys(this[resourceSymbol].allEmbeddedResources())[0];
    this.countProperties();
  }

  get count() {
    return this.getProperty('count');
  }

  get total() {
    return this.getProperty('total');
  }

  /**
   * Loads the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followFirstLink(): Promise<ListResource> {
    return <Promise<ListResource>>this.followLink('first', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
  }

  /**
   * Loads the next {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followNextLink(): Promise<ListResource> {
    return <Promise<ListResource>>this.followLink('next', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
  }

  /**
   * Loads the prev {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followPrevLink(): Promise<ListResource> {
    return <Promise<ListResource>>this.followLink('prev', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol]);
  }

  /**
   * Get all list items {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} into this {@link ListResource}.
   *
   * @returns {Array<Resource|ResourceClass>} an array of all list items.
   */
  getAllItems(): Array<any> {
    const array = this[resourceSymbol].embeddedArray(this[nameSymbol]) || [];
    return array.map((resource) => {
      if (this[itemSchemaSymbol]) {
        return new this[itemClassSymbol](resource, this[environmentSymbol], this[itemSchemaSymbol]);
      }
      return new this[itemClassSymbol](resource, this[environmentSymbol]);
    });
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @returns {Resource|ResourceClass} the first item.
   */
  getFirstItem(): Resource {
    return this.getItem(0);
  }

  /**
   * Get the n'th {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @param {number} n index of the item
   * @returns {Resource|ResourceClass} the requested item.
   */
  getItem(n: number): Resource {
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
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'first'.
   *
   * @returns {boolean} whether or not a link with the name 'first' was found.
   */
  hasFirstLink(): boolean {
    return this.hasLink('first');
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'next'.
   *
   * @returns {boolean} whether or not a link with the name 'next' was found.
   */
  hasNextLink(): boolean {
    return this.hasLink('next');
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
    * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
     * link}  with the name 'prev'.
   *
   * @returns {boolean} whether or not a link with the name 'prev' was found.
   */
  hasPrevLink(): boolean {
    return this.hasLink('prev');
  }

  /**
   * The map() method creates a new array with the results of calling a provided function on every
   * item in this list. It will use {@link ListResource#followNextLink}.
   *
   * @param {function} iterator function that produces an element of the new array.
   * @returns {Promise} returns Promise resolving to the new array.
   */
  map(iterator: (resource: Resource) => Promise<any> | any): Promise<Array<Resource>> {
    return map(this, iterator);
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.count) {
          return { value: this.getItem(this.index++), done: false };
        } else {
          this.index = 0;
          return { done: true };
        }
      }
    }
  };
}

/**
 * @typedef {class} ListResourceClass
 * @access private
 */

/**
 * @typedef {class} ResourceClass
 * @access private
 */

export type filterOptions = {
  size?: number,
  page?: number,
  sort?: Array<string>,
  _levels?: number,
  _fields?: Array<string>,

  [key: string]: filterType
}

export type filter = {
  exact?: string,
  search?: string,
  from?: any,
  to?: any,
  any?: Array<string>,
  all?: Array<string>
}

export type filterType = Array<string> | number | string | filter;
