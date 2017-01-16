'use strict';

import ListResource from './ListResource';
import DataManagerResource from './DataManagerResource';
import {post} from '../Core';

export default class DataManagerList extends ListResource {
  constructor(resource, name, traversal) {
    super(resource, name, traversal);
    this.ListClass = ListResource;
    this.ItemClass = DataManagerResource;
  }

  create(item) {
    if (!item) {
      throw new Error('Cannot create resource with undefined object.');
    }
    // TODO schema validation
    return post(this.newRequest().follow('self'), item);
  }
}

