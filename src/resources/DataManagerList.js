'use strict';

import ListResource from './ListResource';
import DataManagerResource from './DataManagerResource';
import { post } from '../Core';

/**
 * DataManager list resource class.
 *
 * @class
 */
export default class DataManagerList extends ListResource {
  /**
   * Creates a new {@link DataManagerList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {?string} name name of the embedded resources.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, name, traversal) {
    super(resource, name, traversal);
    this.ListClass = ListResource;
    this.ItemClass = DataManagerResource;
  }

  /**
   * Create a new DataManager.
   *
   * @param {object} datamanager object representing the datamanager.
   * @returns {DataManagerResource} the newly created DataManagerResource
   */
  create(datamanager) {
    if (!datamanager) {
      throw new Error('Cannot create resource with undefined object.');
    }
    // TODO schema validation
    return post(this.newRequest().follow('self'), datamanager)
    .then(([dm, traversal]) => new DataManagerResource(dm, traversal));
  }
}
