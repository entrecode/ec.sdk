import * as halfred from 'halfred';

import EntryResource from './EntryResource';
import ListResource from '../ListResource';
import { getSchema } from '../../helper';
import { environment } from '../../Core';

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
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @returns {EntryResource} the first item.
   */
  getFirstItem(): EntryResource {
    return <EntryResource>super.getFirstItem();
  }

  /**
   * Get the n'th {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @param {number} n index of the item
   * @returns {EntryResource} the requested item.
   */
  getItem(n: number): EntryResource {
    return <EntryResource>super.getItem(n);
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
      return getSchema(res.link('self').profile);
    })
    .then(schema => new EntryList(resource, environment, traversal, name, schema));
}
