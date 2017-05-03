import validator from 'json-schema-remote';

import superagent from 'superagent';
import * as qs from 'querystring';

import { get, getUrl, optionsToQuery, post, superagentPost } from '../../helper';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import DMClientList from './DMClientList';
import DMClientResource from './DMClientResource';
import DMAccountList from './DMAccountList';
import DMAccountResource from './DMAccountResource';
import RoleList from './RoleList';
import RoleResource from './RoleResource';
import AssetList from './AssetList';
import AssetResource from './AssetResource';
import DMStatsList from './DMStatsList';
import Resource from '../Resource';

/**
 * DataManager resource class.
 *
 * @class
 *
 * @prop {string}         dataManagerID   - The id of the dataManager
 * @prop {object}         config          - The dataManager config
 * @prop {Date}           created         - The Date this dataManager was created
 * @prop {string}         description     - The description
 * @prop {string}         hexColor        - The hexColor for frontend usage
 * @prop {Array<string>}  locales         - Array of available locales
 * @prop {string}         shortID         - Shortened {@link DataManager#dataManagerID}
 * @prop {string}         title           - Title of the dataManager
 */
export default class DataManagerResource extends Resource {
  /**
   * Creates a new {@link DataManagerResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      dataManagerID: {
        enumerable: true,
        get: () => this.getProperty('dataManagerID'),
      },

      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      description: {
        enumerable: true,
        get: () => this.getProperty('description'),
        set: (value) => {
          this.setProperty('description', value);
          return value;
        },
      },
      hexColor: {
        enumerable: true,
        get: () => this.getProperty('hexColor'),
        set: (value) => {
          this.setProperty('hexColor', value);
          return value;
        },
      },
      locales: {
        enumerable: true,
        get: () => this.getProperty('locales'),
        set: (value) => {
          this.setProperty('locales', value);
          return value;
        },
      },
      shortID: {
        enumerable: true,
        get: () => this.getProperty('shortID'),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
    });
  }

  /**
   * Load a {@link ModelList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the
   *   filter options.
   * @returns {Promise<ModelList>} resolves to model list with applied filters.
   */
  modelList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (
        Object.keys(o).length === 2 && 'dataManagerID' in o && 'modelID' in o
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
        && (typeof o.modelID === 'string' || (!('any' in o.modelID) && !('all' in o.modelID)))
      ) {
        throw new Error('Cannot filter modelList only by dataManagerID and modelID. Use DataManagerResource#model() instead.');
      }

      return get(
        this.environment,
        this.newRequest().follow('ec:models/options')
        .withTemplateParameters(optionsToQuery(o, this.resource.link('ec:models/options').href))
      );
    })
    .then(([resource, traversal]) => new ModelList(resource, this.environment, traversal));
  }

  /**
   * Get a single {@link ModelResource} identified by modelID.
   *
   * @param {string} modelID id of the Model.
   * @returns {Promise<ModelResource>} resolves to the Model which should be loaded.
   */
  model(modelID) {
    return Promise.resolve()
    .then(() => {
      if (!modelID) {
        throw new Error('modelID must be defined');
      }

      return get(
        this.environment,
        this.newRequest().follow('ec:models/options').withTemplateParameters({ modelID })
      );
    })
    .then(([resource, traversal]) => new ModelResource(resource, this.environment, traversal));
  }

  /**
   * Load the {@link DMClientList}.
   *
   * @example
   * return dm.clientList()
   * .then(clients => {
   *   return clients.getAllItems().filter(client => client.clientID === 'thisOne');
   * })
   * .then(clientArray => {
   *   return show(clientArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.clientList({
   *   filter: {
   *     clientID: 'thisOne',
   *   },
   * })
   * .then(clients => {
   *   return show(clients.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMClientList>} Promise resolving to DMClientList
   */
  clientList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (
        Object.keys(o).length === 2 && 'clientID' in o && 'dataManagerID' in o
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
        && (typeof o.clientID === 'string' || (!('any' in o.clientID) && !('all' in o.clientID)))
      ) {
        throw new Error('Cannot filter clientList only by dataManagerID and clientID. Use DataManagerResource#client() instead');
      }

      const request = this.newRequest()
      .follow('ec:dm-clients/options')
      .withTemplateParameters(optionsToQuery(o, this.resource.link('ec:dm-clients/options').href));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DMClientList(res, this.environment, traversal));
  }

  /**
   * Load a single {@link DMClientResource}.
   *
   * @example
   * return dm.client('thisOne')
   * .then(client => {
   *   return show(client);
   * });
   *
   * @param {string} clientID the clientID
   * @returns {Promise<DMClientResource>} Promise resolving to DMClientResource
   */
  client(clientID) {
    return Promise.resolve()
    .then(() => {
      if (!clientID) {
        throw new Error('clientID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:dm-clients/options')
      .withTemplateParameters({ datamanagerid: this.dataManagerID, clientid: clientID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DMClientResource(res, this.environment, traversal));
  }

  /**
   * Create a new dm client.
   *
   * @param {object} client object representing the client.
   * @returns {Promise<DMClientResource>} the newly created DMClientResource
   */
  createClient(client) {
    return Promise.resolve()
    .then(() => {
      if (!client) {
        throw new Error('Cannot create resource with undefined object.');
      }
      // TODO schema validation
      return post(this.newRequest().follow('ec:dm-clients'), client);
    })
    .then(([dm, traversal]) => new DMClientResource(dm, this.environment, traversal));
  }

  /**
   * Load a {@link DMAccountList} of {@link DMAccountResource} filtered by the values specified
   * by the options parameter.
   *
   * @example
   * return dm.accountList({
   *   filter: {
   *     created: {
   *       from: new Date(new Date.getTime() - 600000).toISOString()),
   *     },
   *   },
   * })
   * .then((list) => {
   *   return show(list);
   * })
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<DMAccountList>} resolves to account list with applied filters.
   */
  accountList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (
        Object.keys(o).length === 2 && 'accountID' in o && 'dataManagerID' in o
        && (typeof o.accountID === 'string' || (!('any' in o.accountID) && !('all' in o.accountID)))
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
      ) {
        throw new Error('Cannot filter accountList only by dataManagerID and accountID. Use DataManagerResource#account() instead');
      }

      const request = this.newRequest()
      .follow('ec:dm-account/options')
      .withTemplateParameters(optionsToQuery(o, this.resource.link('ec.dm-account/options').href));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DMAccountList(res, this.environment, traversal));
  }

  /**
   * Get a single {@link DMAccountResource} identified by accountID.
   *
   * @example
   * return dm.account(accountID)
   * .then((account) => {
   *   return show(account.email);
   * });
   *
   * @param {string} accountID id of the Account.
   * @returns {Promise<DMAccountResource>} resolves to the Account which should be loaded.
   */
  account(accountID) {
    return Promise.resolve()
    .then(() => {
      if (!accountID) {
        throw new Error('accountID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:dm-accounts/options')
      .withTemplateParameters({ accountid: accountID, datamanagerid: this.dataManagerID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new DMAccountResource(res, this.environment, traversal));
  }

  /**
   * Load the {@link RoleList}.
   *
   * @example
   * return dm.roleList()
   * .then(roles => {
   *   return roles.getAllItems().filter(client => client.clientID === 'thisOne');
   * })
   * .then(roleArray => {
   *   return show(roleArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.roleList({
   *   filter: {
   *     roleID: 'thisOne',
   *   },
   * })
   * .then(roles => {
   *   return show(roles.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<RoleList>} Promise resolving to RoleList
   */
  roleList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (
        Object.keys(o).length === 2 && 'roleID' in o && 'dataManagerID' in o
        && (typeof o.roleID === 'string' || (!('any' in o.roleID) && !('all' in o.roleID)))
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
      ) {
        throw new Error('Cannot filter roleList only by dataManagerID and roleID. Use DataManagerResource#role() instead');
      }

      const request = this.newRequest()
      .follow('ec:dm-roles/options')
      .withTemplateParameters(optionsToQuery(o, this.resource.link('ec.dm-roles/options').href));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new RoleList(res, this.environment, traversal));
  }

  /**
   * Load a single {@link RoleResource}.
   *
   * @example
   * return dm.role('thisOne')
   * .then(role => {
   *   return show(role);
   * });
   *
   * @param {string} roleID the roleID
   * @returns {Promise<RoleResource>} Promise resolving to RoleResource
   */
  role(roleID) {
    return Promise.resolve()
    .then(() => {
      if (!roleID) {
        throw new Error('roleID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:dm-roles/options')
      .withTemplateParameters({ dataManagerID: this.dataManagerID, roleID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new RoleResource(res, this.environment, traversal));
  }

  /**
   * Create a new role.
   *
   * @param {object} role object representing the role.
   * @returns {Promise<RoleResource>} the newly created RoleResouce
   */
  createRole(role) {
    return Promise.resolve()
    .then(() => {
      if (!role) {
        throw new Error('Cannot create resource with undefined object.');
      }
      return this.resource.link('ec:dm-role/by-id');
    })
    .then(link => validator.validate(role, `${link.profile}-template`))
    .then(() => post(this.newRequest().follow('ec:dm-roles'), role))
    .then(([dm, traversal]) => new RoleResource(dm, this.environment, traversal));
  }

  /**
   * Load a single {@link DMStatsResource}.
   *
   * @example
   * return dm.stats('id')
   * .then(stats => {
   *   return show(stats);
   * });
   *
   * @returns {Promise<DMStatsResource>} Promise resolving to DMStatsResource
   */
  stats() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:dm-stats');
      return get(this.environment, request);
    })
    .then(([res]) => new DMStatsList(res, this.environment).getFirstItem());
  }

  /**
   * Load the {@link AssetList}.
   *
   * @example
   * return dm.assetList()
   * .then(assets => {
   *   return assets.getAllItems().filter(asset => asset.assetID === 'thisOne');
   * })
   * .then(assetsArray => {
   *   return show(assetsArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.assetList({
   *   filter: {
   *     assetID: 'thisOne',
   *   },
   * })
   * .then(assets => {
   *   return show(assets.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<AssetList>} Promise resolving to AssetList
   */
  assetList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (
        Object.keys(o).length === 2 && 'assetID' in o && 'dataManagerID' in o
        && (typeof o.assetID === 'string' || (!('any' in o.assetID) && !('all' in o.assetID)))
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
      ) {
        throw new Error('Cannot filter assetList only by dataManagerID and assetID. Use DataManagerResource#asset() instead');
      }

      const request = this.newRequest()
      .follow('ec:assets/options')
      .withTemplateParameters(optionsToQuery(o, this.resource.link('ec:assets/options').href));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AssetList(res, this.environment, traversal));
  }

  /**
   * Load a single {@link AssetResource}.
   *
   * @example
   * return dm.asset('thisOne')
   * .then(asset => {
   *   return show(asset);
   * });
   *
   * @param {string} assetID the assetID
   * @returns {Promise<AssetResource>} Promise resolving to AssetResource
   */
  asset(assetID) {
    return Promise.resolve()
    .then(() => {
      if (!assetID) {
        throw new Error('assetID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:assets/options')
      .withTemplateParameters({ dataManagerID: this.dataManagerID, assetID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AssetResource(res, this.environment, traversal));
  }

  /**
   * Create a new asset.
   *
   * @param {object|string} input representing the asset, either a path, a FormData object,
   *  a readStream, or an object containing a buffer.
   * @param {object} options options for creating an asset.
   * @returns {Promise<Promise<AssetResource>>} the newly created AssetResource
   */
  createAsset(input, options = {}) {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return getUrl(this.environment, this.newRequest().follow('ec:assets'))
    .then((url) => {
      const superagentRequest = superagent.post(url);

      const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line
                                                                                      // no-undef
      if (isFormData) {
        superagentRequest.send(input);
      } else if (typeof input === 'string') {
        superagentRequest.attach('file', input);
      } else if (Buffer.isBuffer(input)) {
        if (!('fileName' in options)) {
          throw new Error('When using buffer file input you must provide options.fileName.');
        }
        superagentRequest.attach('file', input, options.fileName);
      } else {
        throw new Error('Cannot handle input.');
      }

      if (options.title) {
        if (isFormData) {
          input.field('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.field('tags', options.tags);
        } else {
          superagentRequest.field('tags', options.tags);
        }
      }

      return superagentPost(this.environment, superagentRequest);
    })
    .then((response) => {
      const url = response._links['ec:asset'].href;
      const queryStrings = qs.parse(url.substr(url.indexOf('?') + 1));
      return () => this.asset(queryStrings.assetID);
    });
  }

  /**
   * Create multiple new asset.
   *
   * @param {object|array<object|string>} input representing the asset, either an array of paths, a
   *   FormData object, a array of readStreams, or an array containing buffers.
   * @param {object} options options for creating an asset.
   * @returns {Promise<Promise<AssetList>>} the newly created assets as AssetList
   */
  createAssets(input, options = {}) {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return getUrl(this.environment, this.newRequest().follow('ec:assets'))
    .then((url) => {
      const superagentRequest = superagent.post(url);

      const isFormData = typeof FormData === 'function' && input instanceof FormData; // eslint-disable-line
                                                                                      // no-undef
      if (isFormData) {
        superagentRequest.send(input);
      } else {
        input.forEach((file, index) => {
          if (typeof file === 'string') {
            superagentRequest.attach('file', file);
          } else if (Buffer.isBuffer(file)) {
            if (!('fileName' in options)
              || !Array.isArray(options.fileName)
              || !options.fileName[index]) {
              throw new Error('When using buffer file input you must provide options.fileName.');
            }
            superagentRequest.attach('file', file, options.fileName[index]);
          } else {
            throw new Error('Cannot handle input.');
          }
        });
      }
      if (options.title) {
        if (isFormData) {
          input.field('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.field('tags', options.tags);
        } else {
          superagentRequest.field('tags', options.tags);
        }
      }

      return superagentPost(this.environment, superagentRequest);
    })
    .then((response) => {
      const urls = response._links['ec:asset'].map((link) => {
        const queryStrings = qs.parse(link.href.substr(link.href.indexOf('?') + 1));
        return queryStrings.assetID;
      });

      return () => this.assetList({ assetID: { any: urls } });
    });
  }

  /**
   * Export this datamanager as postman collection.
   *
   * @returns {Promise<object>} The exported datamanager with collection and dataSchema.
   */
  export() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamananger/export');
      return get(this.environment, request);
    })
    .then(([res]) => res);
  }
}
