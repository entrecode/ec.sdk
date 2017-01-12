'use strict';

import ListResource from './ListResource';

export default class DataManagerList extends ListResource {
  create(datamanager) {
    if (!datamanager) {
      throw new Error('Cannot create Data Manager with undefined object');
    }

    // TODO validate datamanager (with template D:)
    return super.create(datamanager);
  }
}

