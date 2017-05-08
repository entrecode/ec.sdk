import halfred from 'halfred';

import { get } from './helper';
import { urls } from './DataManager';
import TokenStoreFactory from './TokenStore';
import Core from './Core';

/**
 * API connector for public APIs.
 */
export default class PublicAPI extends Core {
  /**
   * Creates a new instance of {@link PublicAPI} API connector.
   *
   * @param {string} id shortID of the desired DataManager.
   * @param {environment?} environment the environment to connect to.
   */
  constructor(id, environment) {
    if (environment && !(environment in urls)) {
      throw new Error('invalid environment specified');
    }
    if (!id || !/[a-f0-9]{8}/i.test(id)) {
      throw new Error('must provide valid shortID');
    }

    super(`${urls[environment || 'live']}/api/${id}`);
    this.environment = environment || 'live';
    this.tokenStore = TokenStoreFactory(environment || 'live');
    this.shortID = id;

    this.resource = null;

    ['dataManagerID', 'title', 'description', 'locales',
      'defaultLocale', 'models', 'account', 'config']
    .forEach((property) => {
      Object.defineProperty(this, property, {
        enumerable: true,
        get: () => this.resource[property],
      });
    });
  }

  /**
   * Resolves the root response of ths PublicAPI DataManager
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<PublicAPI>} returns this
   */
  resolve(reload) {
    if (!reload && this.resource) {
      return Promise.resolve(this);
    }

    return get(this.environment, this.newRequest())
    .then(([res, traversal]) => {
      this.resource = halfred.parse(res);
      this.traversal = traversal;

      return this;
    });
  }

  /**
   * Load the list of models. Will resolve to a object with modelTitle as key and {@link Model} as
   * value.
   *
   * @param {boolean?} reload whether or not to force reload
   * @returns {Promise<any>} Object with models
   */
  modelList(reload) {
    return this.resolve(reload)
    .then(() => {
      const out = {};
      this.models.forEach((model) => {
        // TODO proper model object
        out[model.title] = model;
      });
      this.modelCache = out;
      return out;
    });
  }
}
