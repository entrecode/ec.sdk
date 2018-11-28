import * as halfred from 'halfred';

import EntryResource from './EntryResource';
import ListResource from '../ListResource';
import { getSchema } from '../../helper';
import { environment } from '../../Core';

const resourceSymbol: any = Symbol.for('resource');
const itemSchemaSymbol: any = Symbol.for('itemSchema');
const nameSymbol: any = Symbol.for('name');
const environmentSymbol: any = Symbol.for('environment');

/**
 * Entry list class
 *
 * @class
 */
export default class EntryList extends ListResource {
  /**
   * Creates a new {@link EntryList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {string} name name of the embedded items.
   * @param {object} schema JSON Schema for list items.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal: any, name: string, schema: any) {
    super(resource, environment, traversal, name, schema, EntryList, EntryResource);
  }

  /**
   * Get all list items {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} into this {@link EntryListResource}.
   *
   * @returns {Array<EntryResource>} an array of all list items.
   */
  getAllItems(): Array<any> {
    const array = this[resourceSymbol].embeddedArray(this[nameSymbol]) || [];
    return array.map((resource) => new EntryResource(resource, this[environmentSymbol], this[itemSchemaSymbol]));
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @returns {EntryResource} the first item.
   */
  getFirstItem(): EntryResource {
    return this.getItem(0);
  }

  /**
   * Get the n'th {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @param {number} n index of the item
   * @returns {EntryResource} the requested item.
   */
  getItem(n: number): EntryResource {
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

    return new EntryResource(array[n], this[environmentSymbol], this[itemSchemaSymbol]);
  }
}

/**
 * Asynchronously create a new {@link EntryList}. This can be used when the schema is not known
 * before creating the EntryList.
 *
 * @private
 *
 * @param {object} resource loaded resource
 * @param {environment} environment the environment of this resource
 * @param {object?} traversal traversal for continuing
 * @param {string} name name of the embedded items
 * @returns {Promise<EntryResource>} {@link Promise} resolving to the newly created {@link
 *   EntryResource}
 */
export function createList(resource: any, environment: environment, traversal: any, name: string): Promise<EntryList> {
  return Promise.resolve()
    .then(() => {
      const res = halfred.parse(resource);
      return getSchema(res.link('self').profile as string);
    })
    .then((schema) => new EntryList(resource, environment, traversal, name, schema));
}
