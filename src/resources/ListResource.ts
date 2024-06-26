import Resource from './Resource';
import { retryReq } from '../helper';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');
const itemSchemaSymbol: any = Symbol.for('itemSchema');
const nameSymbol: any = Symbol.for('name');
const itemClassSymbol: any = Symbol('_itemClass');
const listClassSymbol: any = Symbol('_listClass');

async function retry(entry: Resource, iterator: (resource: Resource) => Promise<any> | any, retries: number = 0) {
  return Promise.resolve()
    .then(() => iterator(entry))
    .catch((e) => {
      if (retries < 7 && e.status && e.status >= 500) {
        console.log(`Retry iteration in ${2 ** retries * 1000}ms because of ${e.message}`);
        return new Promise((resolve) => setTimeout(resolve, 2 ** retries * 1000)).then(() =>
          retry(entry, iterator, retries + 1),
        );
      }

      throw e;
    });
}

function map(
  list: ListResource,
  iterator: (resource: Resource) => Promise<any> | any,
  retryFlag: boolean,
  results: Array<Resource> = [],
): Promise<Array<any>> {
  return list
    .getAllItems()
    .map(
      (entry) => (res) =>
        Promise.resolve()
          .then(() => {
            if (retryFlag) {
              return retry(entry, iterator);
            }
            return iterator(entry);
          })
          .then((result) => {
            res.push(result);
            return res;
          }),
    )
    .reduce((current, next) => current.then(next), Promise.resolve(results))
    .then((res: Array<Resource>) => {
      if (!list.hasNextLink()) {
        return res;
      }
      return retryReq(
        () => list.followNextLink().then((next) => map(next, iterator, retryFlag, res)),
        retryFlag ? 0 : 8,
      );
    });
}

function filter(
  list: ListResource,
  iterator: (resource: Resource) => Promise<boolean> | boolean,
  retryFlag: boolean,
  results: Array<Resource> = [],
): Promise<Array<Resource>> {
  return list
    .getAllItems()
    .map(
      (entry) => (res) =>
        Promise.resolve()
          .then(() => {
            if (retryFlag) {
              return retry(entry, iterator);
            }
            return iterator(entry);
          })
          .then((add) => {
            if (add) {
              res.push(entry);
            }
            return res;
          }),
    )
    .reduce((current, next) => current.then(next), Promise.resolve(results))
    .then((res) => {
      if (!list.hasNextLink()) {
        return res;
      }
      return retryReq(
        () => list.followNextLink().then((next) => filter(next, iterator, retryFlag, res)),
        retryFlag ? 0 : 8,
      );
    });
}

function find(
  list: ListResource,
  iterator: (resource: Resource) => Promise<boolean> | boolean,
  retryFlag: boolean,
): Promise<Resource | undefined> {
  return list
    .getAllItems()
    .map(
      (entry) => () =>
        Promise.resolve()
          .then(() => {
            if (retryFlag) {
              return retry(entry, iterator);
            }
            return iterator(entry);
          })
          .then((found) => {
            if (!found) {
              return undefined;
            }
            return entry;
          }),
    )
    .reduce(
      (current, next) =>
        current.then((found) => {
          if (!found) {
            return next();
          }
          return found;
        }),
      Promise.resolve(undefined),
    )
    .then((res) => {
      if (res) {
        return res;
      }

      if (list.hasNextLink()) {
        return retryReq(() => list.followNextLink().then((next) => find(next, iterator, retryFlag)), retryFlag ? 0 : 8);
      }

      return undefined;
    });
}

interface ListResource {
  count: number;
  items: Array<Resource | any>;
  total: number;
}

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
 * @prop {number} total - the number of total items in this list
 */
class ListResource extends Resource {
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
  constructor(
    resource: any,
    environment: string,
    traversal: any,
    name: string,
    itemSchema: any,
    ListClass = ListResource,
    ItemClass = Resource,
  ) {
    super(resource, environment, traversal);

    if (!('count' in resource) && !('total' in resource)) {
      throw new Error('Resource does not look like a ListResource. Maybe single result on filtered list?');
    }

    this[listClassSymbol] = ListClass;
    this[itemClassSymbol] = ItemClass;
    this[itemSchemaSymbol] = itemSchema;
    this[nameSymbol] = name || Object.keys(this[resourceSymbol].allEmbeddedResources())[0];
    ['count', 'total'].forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => <number>this.getProperty(key),
      });
    });
    Object.defineProperty(this, 'items', {
      enumerable: true,
      get: () => this.getAllItems(),
    });
    Object.defineProperty(this, 'index', {
      enumerable: false,
    });
    this.countProperties();
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
      },
    };
  }

  /**
   * The filter() method creates a new array with all elements that pass the test implemented by
   * the provided function. It will use {@link ListResource#followNextLink}. Keep in mind that
   * altering the list within the map method is possible but can change the order of the list. E.g.
   * do not use on lists sorted by modified and update the entries during the process.
   *
   * @param {function} iterator function to test each element of the array. Return true to keep the
   *   element, false otherwise.
   * @param {boolean} retry boolean flag wheter or not to retry on failed requests
   * @returns {Promise} returns Promise resolving to the new array.
   */
  filter(
    iterator: (resource: Resource) => Promise<boolean> | boolean,
    retry: boolean = false,
  ): Promise<Array<Resource>> {
    return filter(this, iterator, retry);
  }

  /**
   * The find() method returns the first element that passes the test implemented by the provided
   * function. It will use {@link ListResource#followNextLink}. Keep in mind that altering the list
   * within the map method is possible but can change the order of the list. E.g. do not use on
   * lists sorted by modified and update the entries during the process.
   *
   * @param {function} iterator function to test each element of the array. Return true to keep the
   *   element, false otherwise.
   * @param {boolean} retry boolean flag wheter or not to retry on failed requests
   * @returns {Promise} returns Promise resolving to the new array.
   */
  find(iterator: (resource: Resource) => Promise<boolean> | boolean, retry: boolean = false): Promise<Resource | void> {
    return find(this, iterator, retry);
  }

  /**
   * Loads the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followFirstLink(): Promise<ListResource> {
    return <Promise<ListResource>>(
      this.followLink('first', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol])
    );
  }

  /**
   * Loads the next {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followNextLink(): Promise<ListResource> {
    return <Promise<ListResource>>(
      this.followLink('next', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol])
    );
  }

  /**
   * Loads the prev {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link ListResource} with the loaded result.
   *
   * @returns {Promise<ListResource|ResourceClass>} the resource identified by the link.
   */
  followPrevLink(): Promise<ListResource> {
    return <Promise<ListResource>>(
      this.followLink('prev', this[listClassSymbol], this[nameSymbol], this[itemSchemaSymbol])
    );
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
    if (n === undefined) {
      // undefined check
      throw new Error('Index must be defined.');
    }
    const array = this[resourceSymbol].embeddedArray(this[nameSymbol]);
    if (!array || array.length === 0) {
      throw new Error("Cannot get n'th item of empty list.");
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
   * item in this list. It will use {@link ListResource#followNextLink}. Keep in mind that altering
   * the list within the map method is possible but can change the order of the list. E.g. do not
   * use on lists sorted by modified and update the entries during the process.
   *
   * @param {function} iterator function that produces an element of the new array.
   * @param {boolean} retry boolean flag wheter or not to retry on failed requests
   * @returns {Promise} returns Promise resolving to the new array.
   */
  map(iterator: (resource: Resource) => Promise<any> | any, retry: boolean = false): Promise<Array<Resource>> {
    return map(this, iterator, retry);
  }
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
  size?: number;
  page?: number;
  sort?: Array<string>;
  _levels?: number;
  _fields?: Array<string>;

  [key: string]: filterType;
};

export type filter = {
  exact?: string;
  not?: string;
  null?: boolean;
  notNull: boolean;
  search?: string;
  from?: any;
  to?: any;
  any?: Array<string>;
  all?: Array<string>;
};

export default ListResource;

export type filterType = Array<string> | number | string | filter | object | boolean | undefined;

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
 * @typedef {Object} filterOptions
 * @property {number} size
 * @property {number} page
 * @property {Array<string} sort
 * @property {number} _levels
 * @property {Array<string>} _fields
 * @property {filter} property This could be any field name of a model
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
 * @typedef {Object} filter
 * @property {string|filterObject} property
 */

/**
 * @typedef {Object} filterObject
 * @property {string} exact
 * @property {string} not
 * @property {boolean} null
 * @property {boolean} notNull
 * @property {string} search
 * @property {string} from
 * @property {string} to
 * @property {Array<string>} any
 * @property {Array<string>} all
 */
