import halfred from 'halfred';

import { getSchema } from '../../helper';
import ListResource from '../ListResource';
import EntryResource from './EntryResource';

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
  constructor(resource, environment, traversal, name, schema) {
    super(resource, environment, traversal, name, schema, EntryList, EntryResource);
  }
}

/**
 * Asynchronously create a new {@link EntryList}. This can be used when the schema is not known
 * before creating the EntryList.
 *
 * @param {object} resource loaded resource
 * @param {environment} environment the environment of this resource
 * @param {object?} traversal traversal for continuing
 * @param {string} name name of the embedded items
 * @returns {Promise<EntryResource>} {@link Promise} resolving to the newly created {@link
  *   EntryResource}
 */
export function createList(resource, environment, traversal, name) {
  return Promise.resolve()
  .then(() => {
    const res = halfred.parse(resource);
    return getSchema(res.link('self').profile);
  })
  .then(schema => new EntryList(resource, environment, traversal, name, schema));
}
