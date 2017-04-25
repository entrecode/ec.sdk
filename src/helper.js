import superagent from 'superagent';
import locale from 'locale';

import Problem from './Problem';
import events from './EventEmitter';
import TokenStoreFactory from './TokenStore';
import packageJson from '../package.json';

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
function jsonHandler(callback) {
  return function jsonHandler(err, res, traversal) {
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
 * Creates a callback which wraps a traverson repsonse from `get`, `post`, `put`, `delete` and
 * handles http status codes.
 * The callback will only handle status codes 200-299 as success. All
 * other codes are handled as errors.
 *
 * @access private
 *
 * @param {function} callback the callback which should be wrapped.
 * @returns {function}  function whichs wraps the given callback.
 */
function unparsedHandler(callback) {
  return function unparsedHandler(err, res, traversal) {
    if (err) {
      return callback(err);
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return callback(null, [res.body, traversal]);
    }

    return callback(new Error(res.body));
  };
}

/**
 * Generic Promise wrapper for traverson functions.
 *
 * @access private
 *
 * @param {string} func traverson function which should be called
 * @param {environment} environment environment from which a token should be used
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
        if (TokenStoreFactory(environment) && err instanceof Problem &&
          (err.code % 1000 === 401 || err.code % 1000 === 402)) {
          TokenStoreFactory(environment).del();
          events.emit('logout', err);
        }

        events.emit('error', err);
        return reject(err);
      }

      return resolve(res);
    };

    t.addRequestOptions({ headers: { Accept: 'application/hal+json' } });

    const store = TokenStoreFactory(environment);
    if (store.has()) {
      t.addRequestOptions({ headers: { Authorization: `Bearer ${store.get()}` } });
    }

    if (store.hasUserAgent()) {
      t.addRequestOptions({ headers: { 'X-User-Agent': `${store.getUserAgent()} ec.sdk/${packageJson.version}` } });
    } else {
      t.addRequestOptions({ headers: { 'X-User-Agent': `ec.sdk/${packageJson.version}` } });
    }

    if (func === 'getUrl') {
      t[func](cb);
    } else if (func === 'getEmpty') {
      t.get(unparsedHandler(cb));
    } else if (func === 'postEmpty') {
      t.post(body, unparsedHandler(cb));
    } else if (func === 'post' || func === 'put') {
      t.addRequestOptions({ headers: { 'Content-Type': 'application/json' } });
      t[func](body, jsonHandler(cb));
    } else {
      t[func](jsonHandler(cb));
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
 * @param {environment} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function get(environment, t) {
  return traversonWrapper('get', environment, t);
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
 * @param {environment} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to undefined.
 */
export function getEmpty(environment, t) {
  return traversonWrapper('getEmpty', environment, t)
  .then(() => Promise.resolve());
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
 * @param {environment} environment environment from which a token should be used
 * @param {object} t request builder
 * @param {object} body the request body
 * @returns {Promise} resolves to undefined.
 */
export function postEmpty(environment, t, body) {
  return traversonWrapper('postEmpty', environment, t, body)
  .then(() => Promise.resolve());
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
 * @param {environment} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to the url.
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
 * @param {environment} environment environment from which a token should be used
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
 * @param {environment} environment environment from which a token should be used
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
 * @param {environment} environment environment from which a token should be used
 * @param {object} t request builder
 * @returns {Promise} resolves to the response from the API.
 */
export function del(environment, t) {
  return traversonWrapper('delete', environment, t);
}

/**
 * Superagent Wrapper for posting forms.
 *
 * @access private
 *
 * @param {string} url the url to post to
 * @param {object} form the form to post as object
 * @returns {Promise} Promise resolving to response body.
 */
export function superagentFormPost(url, form) {
  return superagent.post(url)
  .type('form')
  .send(form)
  .then(res => Promise.resolve(res.body ? res.body : {}))
  .catch((err) => {
    let problem;
    if ({}.hasOwnProperty.call(err, 'status')) {
      problem = new Problem(err.response.body);
    }
    events.emit('error', problem || err);
    throw problem || err;
  });
}

/**
 * Superagent Wrapper for GET.
 *
 * @access private
 *
 * @param {string} url the url to get
 * @param {object} headers additional headers
 * @returns {Promise} Promise resolving to response body.
 */
export function superagentGet(url, headers) {
  const request = superagent.get(url);

  if (headers) {
    request.set(headers);
  }

  return request.then(res => Promise.resolve(res.body ? res.body : {}))
  .catch((err) => {
    let problem;
    if ('status' in err) {
      problem = new Problem(err.response.body);
    }
    events.emit('error', problem || err);
    throw problem || err;
  });
}

export function superagentGetPiped(url, pipe) {
  const request = superagent.get(url);

  return new Promise((resolve, reject) => {
    request.on('error', reject);
    pipe.on('finish', resolve);
    request.pipe(pipe);
  });
}

/**
 * Superagent Wrapper for POST.
 *
 * @access private
 *
 * @param {string} environment environment from which a token should be used
 * @param {object} request the url to post to
 * @returns {Promise} Promise resolving to response body.
 */
export function superagentPost(environment, request) {
  request.set('Accept', 'application/hal+json');

  const store = TokenStoreFactory(environment);
  if (store.has()) {
    request.set('Authorization', `Bearer ${store.get()}`);
  }

  if (store.hasUserAgent()) {
    request.set('X-User-Agent', `${store.getUserAgent()} ec.sdk/${packageJson.version}`);
  } else {
    request.set('X-User-Agent', `ec.sdk/${packageJson.version}`);
  }

  return request.then(res => Promise.resolve(res.body ? res.body : {}))
  .catch((err) => {
    let problem;
    if ('status' in err) {
      problem = new Problem(err.response.body);
    }
    events.emit('error', problem || err);
    throw problem || err;
  });
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
 * @param {string?} templateURL optional templateURL for validating inputs
 * @returns {object} translated querystring object
 */
export function optionsToQuery(options, templateURL) {
  const out = {};

  if (options) {
    Object.keys(options).forEach((key) => {
      if (['size', 'page'].includes(key)) {
        out[key] = options[key];
      } else if (key === 'sort') {
        if (Array.isArray(options.sort)) {
          out.sort = options.sort.join(',');
        } else if (typeof options.sort === 'string') {
          out.sort = options.sort;
        } else {
          throw new Error('sort must be either Array or String.');
        }
      } else if (typeof options[key] === 'string') {
        out[key] = options[key];
      } else if (typeof options[key] === 'object') {
        Object.keys(options[key]).forEach((searchKey) => {
          switch (searchKey) {
          case 'exact':
          case 'search':
          case 'from':
          case 'to':
            out[`${key}${modifier[searchKey]}`] = options[key][searchKey];
            break;
          case 'any':
          case 'all':
            if (!Array.isArray(options[key][searchKey])) {
              throw new Error(`${key}.${searchKey} must be an Array.`);
            }
            out[key] = options[key][searchKey].join(modifier[searchKey]);
            break;
          default:
            throw new Error(`No handling of ${key}.${searchKey} filter supported.`);
          }
        });
      } else {
        throw new Error(`${key} must be either Object or String.`);
      }
    });
  }

  if (templateURL) {
    const results = templateURL.match(/{[^}]*}/g)
    .map(result => /^[{?&]+([^}]+)}$/.exec(result)[1].split(','))
    .reduce((a, b) => a.concat(b), []);

    const missings = Object.keys(out).filter(k => !results.includes(k));

    if (missings.length > 0) {
      const err = new Error('Invalid filter options. Check error#array for details.');
      err.array = missings.map((missing) => {
        if (missing.indexOf('~') !== -1) {
          return new Error(`Cannot apply 'search' filter to '${missing.substr(0, missing.indexOf('~'))}'`);
        } else if (missing.indexOf('From') !== -1) {
          return new Error(`Cannot apply 'from' filter to '${missing.substr(0, missing.indexOf('From'))}'`);
        } else if (missing.indexOf('To') !== -1) {
          return new Error(`Cannot apply 'to' filter to '${missing.substr(0, missing.indexOf('To'))}'`);
        } else if (['page', 'size', 'sort'].includes(missing)) {
          return new Error(`Cannot apply ${missing} option`);
        }
        return new Error(`Cannot apply 'exact' filter to '${missing}'`);
      });
      throw err;
    }
  }

  return out;
}

/**
 * Helper for negotiating files from assets.
 *
 * @param {AssetResource} asset - The asset from which negotiation should occur.
 * @param {boolean} image - true if it is an image negotiation.
 * @param {boolean} thumb - true if it is a thumbnail negotiation.
 * @param {number?} size - the minimum size to request.
 * @param {string?} requestedLocale - locale to request.
 * @returns {string} url for the requested asset.
 */
export function fileNegotiate(asset, image, thumb, size, requestedLocale) {
  let f = JSON.parse(JSON.stringify(asset.files));

  if (requestedLocale) {
    const supportedLocales = new locale.Locales(
      [...new Set(f.map(e => e.locale))] // unique
      .filter(a => !!a));// remove falsy values
    let bestLocale = (new locale.Locales(requestedLocale)).best(supportedLocales).toString();
    bestLocale = /^([^.]+)/.exec(bestLocale)[1]; // remove charset
    const filesWithLocale = f.filter(file => file.locale === bestLocale);
    if (filesWithLocale && filesWithLocale.length > 0) {
      f = filesWithLocale;
    }
  }
  if (!image && !thumb && asset.type !== 'image') { // for getFileUrl pic fist file and return - not for images
    return f[0].url;
  }

  const first = f[0];
  // remove image files we have no resolution for (image/svg+xml; fix for CMS-1091)
  f = f.filter(file => file.resolution);
  if (f.length === 0) { // if no file is left pick first of original data
    return first.url;
  }
  f.sort((left, right) => { // sort by size descending
    const leftMax = Math.max(left.resolution.height, left.resolution.width);
    const rightMax = Math.max(right.resolution.height, right.resolution.width);
    if (leftMax < rightMax) {
      return 1;
    }
    if (leftMax > rightMax) {
      return -1;
    }
    return 0;
  });
  let imageFiles = f.filter((file) => {
    if (thumb) {
      return file.url.indexOf('_thumb') !== -1; // is thumbnail
    }
    return file.url.indexOf('_thumb') === -1; // is not a thumbnail
  });
  if (!imageFiles || imageFiles.length === 0) {
    imageFiles = f;
  }
  const largest = imageFiles[0];
  if (size) {
    // remove all image resolutions that are too small
    imageFiles = imageFiles
    .filter(file => file.resolution.height >= size || file.resolution.width >= size)
    // choose smallest image of all that are greater than size parameter
    .slice(-1);
  }

  if (imageFiles.length > 0) { // if all is good, we have an image now
    return imageFiles[0].url;
  }
  // if the requested size is larger than the original image, we take the largest possible one
  return largest.url;
};
