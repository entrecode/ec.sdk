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
      return callback(null, [res.body || {}, traversal]);
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
