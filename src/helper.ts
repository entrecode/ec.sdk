import * as superagent from 'superagent';
import * as validator from 'json-schema-remote';
import { newError } from 'ec.errors';

import { EventEmitterFactory } from './EventEmitter';
import Problem from './Problem';
import TokenStoreFactory, { TokenStore } from './TokenStore';
import { FilterOptions } from './resources/FilterOptions';

import { environment } from './types';

import packageJson from '../package.json';

const historyMap = new Map();

let EventSource: boolean | any = false;

validator.setLoggingFunction(() => {});

// eslint-disable-next-line import/no-mutable-exports
export let locale = 'en';

export function setLocale(globalLocale: string = 'en') {
  locale = globalLocale;
}

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
      if (res.statusCode === 204 || res.statusCode === 202) {
        // no content or accepted
        return callback(null, []);
      }
      if (res.headers['content-type'] && res.headers['content-type'].startsWith('text') && res.body) {
        return callback(null, [res.body]);
      }
      return callback(null, [res.body ? JSON.parse(res.body) : {}, traversal]);
    }

    let code;
    try {
      switch (res.statusCode) {
        case 404:
          code = '100';
          break;
        case 503:
          code = '003';
          break;
        case 502:
          code = '002';
          break;
        default:
          code = '000';
          break;
      }

      if (!res.body || res.body.length === 0) {
        return callback(
          new Problem(newError(code, `ec.sdk: empty body on unsuccessful status: ${res.statusCode}`), locale),
        );
      }

      return callback(new Problem(JSON.parse(res.body), locale));
    } catch (e) {
      let additional = '';

      try {
        const cont = traversal.continue();
        if (cont.continuation) {
          additional = `for request ${cont.continuation.action.toUpperCase()}`;
          if (cont.continuation.step) {
            if (!Array.isArray(cont.continuation.step)) {
              additional += ` ${cont.continuation.step.url}:`;
            }
          }
        }
      } catch (_e) {
        // we don't care about errors here
        if (res.request) {
          additional = `for request ${res.request.method} ${res.request.path}`;
        } else if (res.req) {
          additional = `for request ${res.req.path}`;
        }
      }

      return callback(
        new Problem(newError(code || '000', `ec.sdk: unable to parse body ${additional}: ${res.body}`)),
        locale,
      );
    }
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
function traversonWrapper(func: string, environment: environment, t: any, body?: any): Promise<any> {
  if (!environment || !t) {
    throw new Error('func, environment and t must be defined');
  }

  return new Promise((resolve, reject) => {
    const cb = (err, res) => {
      if (err) {
        if (
          TokenStoreFactory(environment) &&
          err instanceof Problem &&
          (err.code % 1000 === 401 || err.code % 1000 === 402)
        ) {
          TokenStoreFactory(environment).deleteToken();
          EventEmitterFactory(environment).emit('logout', err);
          // not delete refresh token so we can get new token.
        }

        EventEmitterFactory(environment).emit('error', err);
        return reject(err);
      }

      return resolve(res);
    };

    t.addRequestOptions({ headers: { Accept: 'application/hal+json' } });

    const store = TokenStoreFactory(environment);
    let secondStore: TokenStore | undefined;
    if (!store.hasToken()) {
      // when no token is present see if we have a public environment (with shortID)
      // if so look in second store
      const result = /^(live|stage|nightly|develop|test)[A-Fa-f0-9]{8}$/.exec(environment);
      if (result) {
        secondStore = TokenStoreFactory(<environment>result[1]);
      }
    }

    let token;
    if (store.hasToken()) {
      token = store.getToken();
    } else if (secondStore && secondStore.hasToken()) {
      token = secondStore.getToken();
    }
    if (token) {
      t.addRequestOptions({ headers: { Authorization: `Bearer ${token}` } });
    }

    let userAgent;
    if (store.hasUserAgent()) {
      userAgent = `${store.getUserAgent()} ec.sdk/${packageJson.version}`;
    } else if (secondStore && secondStore.hasUserAgent()) {
      userAgent = `${secondStore.getUserAgent()} ec.sdk/${packageJson.version}`;
    } else {
      userAgent = `ec.sdk/${packageJson.version}`;
    }
    t.addRequestOptions({ headers: { 'X-User-Agent': userAgent } });

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
export function get(environment: environment, t: any): Promise<any> {
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
export function getEmpty(environment: environment, t: any): Promise<void> {
  return traversonWrapper('getEmpty', environment, t).then(() => Promise.resolve());
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
export function postEmpty(environment: environment, t: any, body: any): Promise<void> {
  return traversonWrapper('postEmpty', environment, t, body).then(() => Promise.resolve());
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
export function getUrl(environment: environment, t: any): Promise<string> {
  return traversonWrapper('getUrl', environment, t);
}

export function enableHistoryEvents(eventSourceLib) {
  EventSource = eventSourceLib;
}

export function getHistory(environment: environment, t: any): Promise<EventSource> {
  if (!EventSource) {
    throw new Error("EventSource not enabled. Please inject 'eventsource/lib/eventsource-polyfill'");
  }
  return getUrl(environment, t).then((url) => {
    const store = TokenStoreFactory(environment);
    let secondStore: TokenStore | undefined;
    if (!store.hasToken()) {
      // when no token is present see if we have a public environment (with shortID)
      // if so look in second store
      const result = /^(live|stage|nightly|develop|test)[A-Fa-f0-9]{8}$/.exec(environment);
      if (result) {
        secondStore = TokenStoreFactory(<environment>result[1]);
      }
    }

    let token;
    if (store.hasToken()) {
      token = store.getToken();
    } else if (secondStore && secondStore.hasToken()) {
      token = secondStore.getToken();
    }

    if (token) {
      if (url.indexOf('?') === -1) {
        url = `${url}?_token=${token}`;
      } else {
        url = `${url}&_token=${token}`;
      }
    }

    if (!historyMap.has(url)) {
      historyMap.set(url, new EventSource(url));
    }

    return historyMap.get(url);
  });
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
export function post(environment: environment, t: any, body?: any): Promise<any> {
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
export function put(environment: environment, t: any, body: any): Promise<any> {
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
export function del(environment: environment, t: any): Promise<any> {
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
export function superagentFormPost(environment: environment, url: string, form: any): Promise<any> {
  return superagent['post'](url)
    .type('form')
    .send(form)
    .then((res) => Promise.resolve(res.body ? res.body : {}))
    .catch((err) => {
      let problem;
      if (err.status && err.response && 'body' in err.response) {
        problem = new Problem(err.response.body, locale);
      }
      EventEmitterFactory(environment).emit('error', problem || err);
      throw problem || err;
    });
}

/**
 * Superagent Wrapper for GET.
 *
 * @access private
 *
 * @param {string} url the url to get
 * @param {object?} headers additional headers
 * @param {environment?} environment the environment
 * @returns {Promise} Promise resolving to response body.
 */
export function superagentGet(url: string, headers?: any, environment?: environment): Promise<any> {
  const request = superagent.get(url);

  if (headers) {
    request.set(headers);
  }

  addHeaderToSuperagent(request, environment as environment);

  return request
    .then((res) => (res.body ? res.body : {}))
    .catch((err) => {
      let problem;
      if (err.status && err.response && 'body' in err.response) {
        problem = new Problem(err.response.body, locale);
      }
      EventEmitterFactory(environment).emit('error', problem || err);
      throw problem || err;
    });
}

/**
 * Superagent wrapper for GET with piped output
 *
 * @private
 * @param {string} url the url to get
 * @param {object} pipe the pipe to use
 * @returns {Promise<any>} Promise resolving when pipe is finished
 */
export function superagentGetPiped(url: string, pipe: any): Promise<any> {
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
export function superagentPost(environment: environment, request: any): Promise<any> {
  request.set('Accept', 'application/hal+json');

  addHeaderToSuperagent(request, environment);
  return request
    .then((res) => Promise.resolve(res.body ? res.body : {}))
    .catch((err) => {
      let problem;
      if (err.status && err.response && 'body' in err.response) {
        (problem = new Problem(err.response.body)), locale;
      }
      EventEmitterFactory(environment).emit('error', problem || err);
      throw problem || err;
    });
}

/**
 * Function for retrying requests when they are getting 5xx errors.
 *
 * @access private
 *
 * @param {function} fkt function which should be retried
 * @param {number} retries number of retries. max 7, default 8 so no retry
 */
export function retryReq(fkt: () => Promise<any>, retries: number = 8): Promise<any> {
  return fkt().catch((e) => {
    if (retries < 7 && e.status && e.status >= 500) {
      console.log(`Retry iteration in ${2 ** retries * 1000}ms because of ${e.message}`);
      return new Promise((resolve) => setTimeout(resolve, 2 ** retries * 1000)).then(() => retryReq(fkt, retries + 1));
    }

    throw e;
  });
}

/**
 * Adds Authorization and X-User-Agent header to requests
 *
 * @private
 * @param {any} request The superagent request
 * @param {environment} environment environment from which to load the headers
 */
function addHeaderToSuperagent(request: any, environment: environment) {
  if (environment) {
    const store = TokenStoreFactory(environment);
    let secondStore: TokenStore | undefined;
    if (!store.hasToken()) {
      // when no token is present see if we have a public environment (with shortID)
      // if so look in second store
      const result = /^(live|stage|nightly|develop|test)[A-Fa-f0-9]{8}$/.exec(environment);
      if (result) {
        secondStore = TokenStoreFactory(<environment>result[1]);
      }
    }

    if (store.hasToken()) {
      request.set('Authorization', `Bearer ${store.getToken()}`);
    } else if (secondStore && secondStore.hasToken()) {
      request.set('Authorization', `Bearer ${secondStore.getToken()}`);
    }

    // TODO add token refreshal

    if (store.hasUserAgent()) {
      request.set('X-User-Agent', `${store.getUserAgent()} ec.sdk/${packageJson.version}`);
    } else if (secondStore && secondStore.hasUserAgent()) {
      request.set('X-User-Agent', `${secondStore.getUserAgent()} ec.sdk/${packageJson.version}`);
    } else {
      request.set('X-User-Agent', `ec.sdk/${packageJson.version}`);
    }
  }
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
  null: '',
  not: '!',
  notNull: '!',
  search: '~',
  from: 'From',
  to: 'To',
  any: ',',
  notAny: ',',
  all: ' ',
};

/**
 * Translates {@link filter} objects into querystring objects used by {@link
 * https://github.com/basti1302/traverson traverson}.
 *
 * @access private
 *
 * @param {filterOptions} options filter options
 * @param {string?} templateURL optional templateURL for validating inputs
 * @param {boolean?} encode if true it will encode the parameter values (eg. to support text filter with ',' or '+')
 * @param {boolean?} retry internal retry flag
 * @param {boolean?} allowSearch if true, allows _search parameter (only for PublicAPI.entryList)
 * @returns {object} translated querystring object
 */
export function optionsToQuery(
  options: FilterOptions,
  templateURL?: string,
  encode: boolean = false,
  retry: boolean = false,
  allowSearch: boolean = false,
): any {
  const out: any = {};

  if (options) {
    if (typeof options !== 'object') {
      throw new Error(`filterOptions must be an object, is: ${typeof options}`);
    }

    // Optimize: Use for...of loop instead of forEach for better performance
    for (const key of Object.keys(options)) {
      const value = options[key];
      if (value !== undefined) {
        if (['size', 'page', '_count'].indexOf(key) !== -1) {
          if (!Number.isInteger(<number>value)) {
            throw new Error(`${key} must be integer, is ${typeof value}: ${value}`);
          }
          out[key] = value;
        } else if (key === 'sort') {
          if (Array.isArray(options.sort)) {
            out.sort = options.sort.join(',');
          } else if (typeof options.sort === 'string') {
            out.sort = options.sort;
          } else {
            throw new Error(`sort must be either Array or String, is ${typeof options.sort}`);
          }
        } else if (key === '_levels') {
          if (!Number.isInteger(<number>value)) {
            throw new Error('_levels must be integer, is ' + typeof value);
          }
          if (value > 1 && value <= 5) {
            out[key] = value;
          }
        } else if (key === '_fields') {
          if (!Array.isArray(value)) {
            throw new Error('_fields must be an array');
          }
          const invalid = (<Array<string>>value).filter((val) => typeof val !== 'string');
          if (invalid.length > 0) {
            throw new Error('_fields array must contain only strings');
          }
          out[key] = (<Array<string>>value).join(',');
        } else if (key === '_search') {
          if (!allowSearch) {
            throw new Error('_search is only supported in PublicAPI.entryList');
          }
          if (typeof value !== 'string') {
            throw new Error('_search must be a string');
          }
          out[key] = value;
          if (encode) {
            out[key] = encodeURIComponent(<string>out[key]);
          }
        } else if (typeof value === 'string') {
          out[key] = value;
          if (/[ ,]/.test(out[key])) {
            out[key] = `(${out[key]})`;
          }
          if (encode) {
            out[key] = encodeURIComponent(<string>out[key]);
          }
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          out[key] = value;
        } else if (value instanceof Date) {
          out[key] = (<Date>value).toISOString();
        } else if (typeof value === 'object') {
          // Optimize: Use for...of loop instead of forEach for better performance
          for (const searchKey of Object.keys(value)) {
            switch (searchKey) {
              case 'exact':
              case 'search':
              case 'from':
              case 'to':
              case 'null':
              case 'not':
              case 'notNull':
                if (Array.isArray(value[searchKey])) {
                  throw new Error(`${key}.${searchKey} must not be of type Array`);
                }
                if (typeof value[searchKey] === 'boolean') {
                  out[`${key}${modifier[searchKey]}`] = '';
                } else if (value[searchKey] instanceof Date) {
                  out[`${key}${modifier[searchKey]}`] = value[searchKey].toISOString();
                } else if (typeof value[searchKey] === 'string') {
                  out[`${key}${modifier[searchKey]}`] = value[searchKey];
                  if (searchKey === 'exact' && /[ ,]/.test(out[`${key}${modifier[searchKey]}`])) {
                    out[`${key}${modifier[searchKey]}`] = `(${out[`${key}${modifier[searchKey]}`]})`;
                  }
                  if (encode) {
                    out[`${key}${modifier[searchKey]}`] = encodeURIComponent(out[`${key}${modifier[searchKey]}`]);
                  }
                } else {
                  out[`${key}${modifier[searchKey]}`] = value[searchKey];
                }
                break;
              case 'any':
              case 'all':
              case 'notAny':
                if (!Array.isArray(value[searchKey])) {
                  throw new Error(`${key}.${searchKey} must be an Array.`);
                }
                // eslint-disable-next-line no-case-declarations
                const invalid = value[searchKey].filter((val) => !(typeof val === 'string' || typeof val === 'number'));
                if (invalid.length > 0) {
                  throw new Error(`${key}.${searchKey} array must contain only strings or numbers`);
                }
                // eslint-disable-next-line no-case-declarations
                const k = searchKey === 'notAny' ? `${key}!` : key;
                out[k] = [...value[searchKey]];
                if (out[k].some((v) => /[ ,]/.test(v))) {
                  out[k] = out[k].map((v) => `(${v})`);
                }
                if (encode) {
                  out[k] = out[k].map((v) => encodeURIComponent(v));
                }
                out[k] = out[k].join(modifier[searchKey]);
                break;
              default:
                throw new Error(`No handling of ${key}.${searchKey} filter supported.`);
            }
          }
        } else {
          throw new Error(`${key} must be either Object or String.`);
        }
      }
    }
  }

  if (templateURL) {
    let missings: string[] = [];
    const matchRes = templateURL.match(/{[^}]*}/g);
    if (matchRes) {
      const results = matchRes
        .map((result) => {
          const res = /^{[?&]([^}]+)}$/.exec(result);
          if (res) {
            return res[1].split(',');
          }
          return [];
        })
        .reduce((a, b) => a.concat(b), []);

      missings = Object.keys(out).filter((k) => results.indexOf(k) === -1);
    }

    if (missings.length > 0 && !retry) {
      // sometimes "missing" means the template parameter is lower cased. try it that way
      try {
        const lowerCaseOptions = {};
        // Optimize: Use for...of loop instead of forEach for better performance
        for (const key of Object.keys(options)) {
          if (missings.indexOf(key) !== -1) {
            lowerCaseOptions[key.toLocaleLowerCase()] = options[key];
          } else {
            lowerCaseOptions[key] = options[key];
          }
        }
        const outLowerCase = optionsToQuery(lowerCaseOptions, templateURL, encode, true, allowSearch);
        return outLowerCase;
      } catch (err) {
        // do nothing and proceed with original missing array...
      }
    }

    if (missings.length > 0) {
      const err: any = new Error('Invalid filter options. Check error#subErrors for details.');
      err.subErrors = missings.map((missing) => {
        let error;
        if (missing.indexOf('~') !== -1) {
          error = newError(
            212,
            `Cannot apply 'search' filter to '${missing.substr(0, missing.indexOf('~'))}'`,
            missing.substr(0, missing.indexOf('~')),
          );
        } else if (missing.indexOf('From') !== -1) {
          error = newError(
            212,
            `Cannot apply 'from' filter to '${missing.substr(0, missing.indexOf('From'))}'`,
            missing.substr(0, missing.indexOf('From')),
          );
        } else if (missing.indexOf('To') !== -1) {
          error = newError(
            212,
            `Cannot apply 'to' filter to '${missing.substr(0, missing.indexOf('To'))}'`,
            missing.substr(0, missing.indexOf('To')),
          );
        } else if (['page', 'size', 'sort'].indexOf(missing) !== -1) {
          // TODO was array.includes
          error = newError(212, `Cannot apply ${missing} option`, missing);
        } else {
          error = newError(212, `Cannot apply 'exact' filter to '${missing}'`, missing);
        }

        return new Problem(error, locale);
      });
      throw err;
    }
  }

  return out;
}

/**
 * shortenUUID(uuid[, factor])
 *
 * @access private
 * @private
 *
 * shortens a UUID by XORing the the top half with the bottom half
 * The default shortening factor is 1, maximum is 5 (just one character returned).
 *
 * @param {string} uuid A UUID v4 (including dashes)
 * @param {number} factor A int 1-5, default is 1 (16 characters returned). Recommended is 2 (8
 *   characters returned).
 * @returns {string} 1-16 character hex string
 */
export function shortenUUID(uuid: string, factor: number) {
  let shortUUID;
  let validatedFactor;
  if (
    !/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid) ||
    (factor && typeof factor !== 'number')
  ) {
    throw new Error('invalid parameter format');
  }
  if (!factor || factor < 1 || factor > 5) {
    // set factor to 1 as default
    validatedFactor = 1;
  } else {
    validatedFactor = factor;
  }
  shortUUID = uuid.replace(/-/g, ''); // strip the dashes out of the UUID
  shortUUID = shortUUID.split(''); // turn into Array
  shortUUID = shortUUID.map(
    (
      element, // parse Integer value out of hex value
    ) => parseInt(element, 16),
  );
  let j;
  let l;

  function xor(val, index) {
    return val ^ shortUUID[l / 2 + index]; // XOR the given value of the first half with the
    // corresponding of the second half
  }

  for (j = 0; j < validatedFactor; j++) {
    // factor times XORing
    l = shortUUID.length;
    shortUUID = shortUUID.slice(0, l / 2).map(xor);
  }
  shortUUID = shortUUID.map(
    (
      element, // turn back into hex value
    ) => element.toString(16),
  );
  shortUUID = shortUUID.join(''); // make array to string
  return shortUUID;
}

/**
 * Load a schema identified by link and store it in json-schema-remote
 *
 * @private
 * @param {string} link the schema link to load
 * @returns {any} the loaded schema
 */
export function getSchema(link: string): any {
  return Promise.resolve().then(() => {
    const schema = validator.getSchema(link);
    if (schema) {
      return schema;
    }

    return superagentGet(link).then((loadedSchema) => {
      validator['preload'](link, loadedSchema);
      return loadedSchema;
    });
  });
}
