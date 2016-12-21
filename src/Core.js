import traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import halfred from 'halfred';

import Problem from './Problem';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

export default class Core {
  constructor(url) {
    if (!url) {
      throw new TypeError('url must be defined');
    }

    this.traverson = traverson.from(url).jsonHal()
    .parseResponseBodiesWith(body => halfred.parse(JSON.parse(body)))
    .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
  }

  newRequest() {
    return this.traverson.newRequest();
  }
}

export function traversonGet(t) {
  return new Promise((resolve, reject) => {
    t.get((err, res, traversal) => {
      if (err) {
        return reject(err);
      }

      if (res.statusCode >= 200 && res.statusCode < 300) {
        return resolve([halfred.parse(JSON.parse(res.body)), traversal]);
      }

      return reject(new Problem(res));
    });
  });
}
