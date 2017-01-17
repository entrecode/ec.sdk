'use strict';

import traverson from 'traverson';
import HalAdapter from 'traverson-hal';

import Problem from './Problem';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

function handlerCallback(callback) {
  return function callbackWrapper(err, res, traversal) {
    if (err) {
      return callback(err);
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return callback(null, [res.body ? JSON.parse(res.body) : {}, traversal]);
    }

    return callback(new Problem(JSON.parse(res.body)));
  };
}

export default class Core {
  constructor(url) {
    if (!url) {
      throw new TypeError('url must be defined');
    }

    this.traversal = traverson.from(url).jsonHal()
    .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
  }

  newRequest() {
    if (!this.traversal) {
      throw new Error('Critical: Traversal invalid!');
    }

    if ({}.hasOwnProperty.call(this.traversal, 'continue')) {
      return this.traversal.continue().newRequest();
    }

    return this.traversal.newRequest();
  }
}

export function get(t) {
  return new Promise((resolve, reject) => {
    t.get(handlerCallback((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    }));
  });
}

export function getUrl(t) {
  return new Promise((resolve, reject) => {
    t.getUrl((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}

export function post(t, body) {
  return new Promise((resolve, reject) => {
    t.post(body, handlerCallback((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    }));
  });
}

export function put(t, body) {
  return new Promise((resolve, reject) => {
    t.put(body, handlerCallback((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    }));
  });
}

export function del(t) {
  return new Promise((resolve, reject) => {
    t.del(handlerCallback((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    }));
  });
}

export function optionsToQuery(options) {
  const out = {};

  if (options) {
    if ({}.hasOwnProperty.call(options, 'size')) {
      out.size = options.size;
    }
    if ({}.hasOwnProperty.call(options, 'page')) {
      out.page = options.page;
    }

    if ({}.hasOwnProperty.call(options, 'sort')) {
      if (Array.isArray(options.sort)) {
        out.sort = options.sort.join(',');
      } else if (typeof options.sort === 'string') {
        out.sort = options.sort;
      } else {
        throw new Error('sort must be either Array or String.');
      }
    }

    if ({}.hasOwnProperty.call(options, 'filter')) {
      if (typeof options.filter !== 'object') {
        throw new Error('filter must by an Object.');
      }
      Object.keys(options.filter).forEach((property) => {
        if (typeof options.filter[property] === 'string') {
          out[property] = options.filter[property];
        } else if (typeof options.filter[property] === 'object') {
          if ({}.hasOwnProperty.call(options.filter[property], 'exact')) {
            out[property] = options.filter[property].exact;
          }
          if ({}.hasOwnProperty.call(options.filter[property], 'search')) {
            out[`${property}~`] = options.filter[property].search;
          }
          if ({}.hasOwnProperty.call(options.filter[property], 'from')) {
            out[`${property}From`] = options.filter[property].from;
          }
          if ({}.hasOwnProperty.call(options.filter[property], 'to')) {
            out[`${property}To`] = options.filter[property].to;
          }

          if ({}.hasOwnProperty.call(options.filter[property], 'any')) {
            if (!Array.isArray(options.filter[property].any)) {
              throw new Error(`filter.${property}.any must be an Array.`);
            }
            out[`${property}`] = options.filter[property].any.join(',');
          }
          if ({}.hasOwnProperty.call(options.filter[property], 'all')) {
            if (!Array.isArray(options.filter[property].all)) {
              throw new Error(`filter.${property}.all must be an Array.`);
            }
            out[`${property}`] = options.filter[property].all.join('+');
          }
        } else {
          throw new Error(`filter.${property} must be either Object or String.`);
        }
      });
    }
  }

  return out;
}
