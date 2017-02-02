import Problem from './Problem';
import events from './EventEmitter';
import { stores } from './TokenStore';

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
 * Generic Promise wrapper for traverson functions.
 *
 * @access private
 *
 * @param {string} func traverson function which should be called
 * @param {string} environment environment from which a token should be used
 * @param {object} t traverson build on which func should be called
 * @param {object?} body optional post/put body
 * @returns {Promise} resolves to the response from the API.
 */
function traversonWrapper(func, environment, t, body) {
  if (!environment || !t) {
    throw new Error('func, environment and t must be defined');
  }

  return new Promise((resolve, reject) => {
    const cb = (err, res) => {
      if (err) {
        events.emit('error', err);
        return reject(err);
      }

      return resolve(res);
    };

    const store = stores.get(environment);
    if (store && store.has()) {
      t.addRequestOptions({ headers: { Authorization: `Bearer ${store.get()}` } });
    }

    if (func === 'getUrl') {
      t[func](cb);
    } else if (func === 'post' || func === 'put') {
      t.addRequestOptions({ headers: { 'Content-Type': 'application/json' } })
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
 * @param {string} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function get(environment, t) {
  return traversonWrapper('get', environment, t);
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
 * @param {string} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise.string} resolves to the url.
 */
export function getUrl(environment, t) {
  return traversonWrapper('getUrl', environment, t);
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
 * @param {string} environment environment from which a token should be used
 * @param {object} t request builder
 * @param {object} body post body
 * @returns {Promise} resolves to the response from the API.
 */
export function post(environment, t, body) {
  return traversonWrapper('post', environment, t, body);
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
 * @param {string} environment environment from which a token should be used
 * @param {object} t request builder
 * @param {object} body post body
 * @returns {Promise} resolves to the response from the API.
 */
export function put(environment, t, body) {
  return traversonWrapper('put', environment, t, body);
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
 * @param {string} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function del(environment, t) {
  return traversonWrapper('delete', environment, t);
}

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
