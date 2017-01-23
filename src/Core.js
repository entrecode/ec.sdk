'use strict';

import traverson from 'traverson';
import HalAdapter from 'traverson-hal';
import Problem from './Problem';
import events from './EventEmitter';

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);

/**
 * Modifier for filter object to query convertion.
 *
 * @access private
 *
 * @type {{exact: string, search: string, from: string, to: string, any: string, all: string}}
 */
const modifier = {
  exact: '',
  search: '~',
  from: 'From',
  to: 'To',
  any: ',',
  all: '+',
};

/**
 * Creates a callback which wraps a traverson repsonse from `get`, `post`, `put`, `delete` and
 * handles http status codes.
 * The callback will only handle status codes 200-299 as success. All
 * other codes are handled as errors. The resulting errors will be of type Problem.
 *
 * @access private
 *
 * @param {function} callback the callback which should be wrapped.
 * @returns {function}  function whichs wraps the given callback.
 */
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

/**
 * Core class for connecting to any entrecode API.
 *
 * @interface
 * @class
 */
export default class Core {
  constructor(url) {
    if (!url) {
      throw new Error('url must be defined');
    }

    /**
     * Global {@link EventEmitter}.
     * @type {EventEmitter}
     */
    this.events = events;

    this.traversal = traverson.from(url).jsonHal()
    .addRequestOptions({ headers: { Accept: 'application/hal+json' } });
  }

  /**
   * Set an existing accessToken
   *
   * @param {string} token the existing token
   * @returns {Core} this for chainability
   */
  setToken(token) {
    if (!token) {
      throw new Error('Token must be defined');
    }

    this.traversal.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    return this;
  }

  /**
   * Creates a new {@link
    * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}
   *  which can be used for a new request to the API.
   *
   * @access private
   *
   * @returns {Object} traverson request builder instance.
   */
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

/**
 * Generic Promise wrapper for traverson functions.
 *
 * @access private
 *
 * @param {string} func traverson function which should be called
 * @param {object} t traverson build on which func should be called
 * @param {object?} body optional post/put body
 * @returns {Promise} resolves to the response from the API.
 */
function traversonWrapper(func, t, body) {
  return new Promise((resolve, reject) => {
    const cb = (err, res) => {
      if (err) {
        events.emit('error', err);
        return reject(err);
      }

      return resolve(res);
    };

    if (func === 'getUrl') {
      t[func](cb);
    } else if (func === 'post' || func === 'put') {
      t[func](body, handlerCallback(cb));
    } else {
      t[func](handlerCallback(cb));
    }
  });
}

/**
 * Wraps a {@link
  * https://github.com/basti1302/traverson traverson} get request with a {@link Promise}
 * Parameter t must be a {@link
  * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}.
 * Only http status codes >200 <=299 will resolve, all others will
 * reject.
 *
 * @access private
 *
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function get(t) {
  return traversonWrapper('get', t);
}

/**
 * Wraps a {@link
  * https://github.com/basti1302/traverson traverson} getUrl request with a {@link Promise}
 * Parameter t must be a {@link
  * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}.
 *
 * @access private
 *
 * @param {object} t request builder
 * @returns {Promise.string} resolves to the url.
 */
export function getUrl(t) {
  return traversonWrapper('getUrl', t);
}

/**
 * Wraps a {@link
  * https://github.com/basti1302/traverson traverson} post request with a {@link Promise}
 * Parameter t must be a {@link
  * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}.
 * Only http status codes >200 <=299 will resolve, all others will
 * reject.
 *
 * @access private
 *
 * @param {object} t request builder
 * @param {object} body post body
 * @returns {Promise} resolves to the response from the API.
 */
export function post(t, body) {
  return traversonWrapper('post', t, body);
}

/**
 * Wraps a {@link
  * https://github.com/basti1302/traverson traverson} put request with a {@link Promise}
 * Parameter t must be a {@link
  * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}.
 * Only http status codes >200 <=299 will resolve, all others will
 * reject.
 *
 * @access private
 *
 * @param {object} t request builder
 * @param {object} body post body
 * @returns {Promise} resolves to the response from the API.
 */
export function put(t, body) {
  return traversonWrapper('put', t, body);
}

/**
 * Wraps a {@link
  * https://github.com/basti1302/traverson traverson} delete request with a {@link Promise}
 * Parameter t must be a {@link
  * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
     * traverson request builder}.
 * Only http status codes >200 <=299 will resolve, all others will
 * reject.
 *
 * @access private
 *
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function del(t) {
  return traversonWrapper('delete', t);
}

/**
 * Translates {@link filter} objects into querystring objects used by {@link
  * https://github.com/basti1302/traverson traverson}.
 *
 * @access private
 *
 * @param {filter} options filter options
 * @returns {object} translated querystring object
 */
export function optionsToQuery(options) {
  const out = {};

  if (options) {
    ['size', 'page'].forEach((property) => {
      if ({}.hasOwnProperty.call(options, property)) {
        out[property] = options[property];
      }
    });

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
          Object.keys(options.filter[property]).forEach((key) => {
            switch (key) {
            case 'exact':
            case 'search':
            case 'from':
            case 'to':
              out[`${property}${modifier[key]}`] = options.filter[property][key];
              break;
            case 'any':
            case 'all':
              if (!Array.isArray(options.filter[property][key])) {
                throw new Error(`filter.${property}.${key} must be an Array.`);
              }
              out[property] = options.filter[property][key].join(modifier[key]);
              break;
            default:
              throw new Error(`No handling of ${property}.${key} filter supported.`);
            }
          });
        } else {
          throw new Error(`filter.${property} must be either Object or String.`);
        }
      });
    }
  }

  return out;
}
