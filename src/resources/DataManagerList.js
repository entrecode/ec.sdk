'use strict';

import ListResource from './ListResource';
import {post} from '../Core';

export default class DataManagerList extends ListResource {
  create(item) {
    if (!item) {
      throw new Error('Cannot create resource with undefined object.');
    }
    // TODO schema validation
    return post(this.newRequest().follow('self'), item);
  }
}

