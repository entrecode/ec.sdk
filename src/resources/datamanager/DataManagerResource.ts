import * as qs from 'querystring';
import * as superagent from 'superagent';
import * as validator from 'json-schema-remote';

import AssetList from './AssetList';
import AssetResource from './AssetResource';
import DMAccountList from './DMAccountList';
import DMAccountResource from './DMAccountResource';
import DMClientList from './DMClientList';
import DMClientResource from './DMClientResource';
import DMStatsList from './DMStatsList';
import DMStatsResource from './DMStatsResource';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import Resource from '../Resource';
import RoleList from './RoleList';
import RoleResource from './RoleResource';
import { filterOptions } from '../ListResource';
import { get, getUrl, superagentPost } from '../../helper';
import { environment } from '../../Core';
import PublicAPI from '../../PublicAPI';
import AssetGroupResource from './AssetGroupResource';
import AssetGroupList from './AssetGroupList';

const environmentSymbol = Symbol.for('environment');
const apiSymbol = Symbol('api');
const relationsSymbol = Symbol.for('relations');

validator.setLoggingFunction(() => {
});

interface DataManagerResource {
  config: any,
  created: any,
  dataManagerID: string,
  description: string,
  hexColor: string,
  locales: Array<string>,
  shortID: string,
  title: string,
}

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
class DataManagerResource extends Resource {
  /**
   * Creates a new {@link DataManagerResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    this[relationsSymbol] = {
      account: {
        relation: 'ec:dm-accounts/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accountID',
        additionalTemplateParam: 'dataManagerID',
        ResourceClass: DMAccountResource,
        ListClass: DMAccountList,
      },
      asset: {
        relation: 'ec:assets/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'assetID',
        ResourceClass: AssetResource,
        ListClass: AssetList,
      },
      client: {
        relation: 'ec:dm-clients/options',
        createRelation: 'ec:dm-client/by-id',
        createTemplateModifier: '',
        id: 'clientID',
        ResourceClass: DMClientResource,
        ListClass: DMClientList,
      },
      model: {
        relation: 'ec:models/options',
        createRelation: 'ec:model/by-id',
        createTemplateModifier: '-template',
        id: 'modelID',
        ResourceClass: ModelResource,
        ListClass: ModelList,
      },
      role: {
        relation: 'ec:dm-roles/options',
        createRelation: 'ec:dm-role/by-id',
        createTemplateModifier: '-template',
        id: 'roleID',
        ResourceClass: RoleResource,
        ListClass: RoleList,
      },
      assetGroup: {
        relation: 'ec:dm-assetgroups',
        createRelation: 'ec.dm-assetgroup/by-id',
        createTemplateModifier: '-template-post',
        id: 'assetGroupID',
        ResourceClass: AssetGroupResource,
        ListClass: AssetGroupList,
      },
    };

    Object.defineProperties(this, {
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value: any) => this.setProperty('config', value),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      dataManagerID: {
        enumerable: true,
        get: () => <string>this.getProperty('dataManagerID'),
      },
      description: {
        enumerable: true,
        get: () => this.getProperty('description'),
        set: (value: string) => this.setProperty('description', value),
      },
      hexColor: {
        enumerable: true,
        get: () => <string>this.getProperty('hexColor'),
        set: (value: string) => this.setProperty('hexColor', value),
      },
      locales: {
        enumerable: true,
        get: () => <Array<string>> this.getProperty('locales'),
        set: (value: string) => this.setProperty('locales', value),
      },
      shortID: {
        enumerable: true,
        get: () => <string>this.getProperty('shortID'),
      },
      title: {
        enumerable: true,
        get: () => <string>this.getProperty('title'),
        set: (value: string) => this.setProperty('title', value),
      }
    });
    this.countProperties();
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
  account(accountID: string): Promise<DMAccountResource> {
    return <Promise<DMAccountResource>>this.resource('account', accountID);
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
  accountList(options?: filterOptions): Promise<DMAccountList> {
    return <Promise<DMAccountList>>this.resourceList('account', options, { dataManagerID: this.dataManagerID });
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
  asset(assetID: string): Promise<AssetResource> {
    return <Promise<AssetResource>>this.resource('asset', assetID);
  }

  /**
   * Load a single {@link AssetGroupResource}.
   *
   * @example
   * return dm.asset('thisOne')
   * .then(asset => {
   *   return show(asset);
   * });
   *
   * @param {string} assetGroupID the id
   * @returns {Promise<AssetGroupResource>} Promise resolving to AssetGroupResource
   */
  assetGroup(assetGroupID: string): Promise<AssetGroupResource> {
    return <Promise<AssetGroupResource>>this.resource('assetGroup', assetGroupID);
  }

  /**
   * Load the {@link AssetGroupList}.
   *
   * @example
   * return dm.assetGroupList()
   * .then(groups => {
   *   return groups.getAllItems().filter(group => group.public);
   * })
   * .then(groups => {
   *   return show(groups);
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<AssetGroupList>} Promise resolving to AssetGroupList
   */
  assetGroupList(options: filterOptions | any = {}): Promise<AssetGroupList> {
    return Promise.resolve()
    .then(() => {
      return <Promise<AssetGroupList>>this.resourceList('assetGroup', options);
    });
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
  assetList(options?: filterOptions): Promise<AssetList> {
    return <Promise<AssetList>>this.resourceList('asset', options);
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
  client(clientID: string): Promise<DMClientResource> {
    return <Promise<DMClientResource>>this.resource('client', clientID);
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
  clientList(options?: filterOptions): Promise<DMClientList> {
    return <Promise<DMClientList>>this.resourceList('client', options);
  }

  /**
   * Create a new asset.
   *
   * @param {object|string} input representing the asset, either a path, a FormData object,
   *  a readStream, or an object containing a buffer.
   * @param {object?} options options for creating an asset.
   * @returns {Promise<Promise<AssetResource>>} the newly created AssetResource
   */
  createAsset(input: string | any, options: assetOptions = {}) {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return getUrl(this[environmentSymbol], this.newRequest().follow('ec:assets'))
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
        superagentRequest.attach('file', input, <string>options.fileName);
      } else {
        throw new Error('Cannot handle input.');
      }

      if (options.title) {
        if (isFormData) {
          input.set('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.set('tags', options.tags);
        } else {
          options.tags.forEach((tag) => {
            superagentRequest.field('tags', tag);
          });
        }
      }

      return superagentPost(this[environmentSymbol], superagentRequest);
    })
    .then((response) => {
      const url = response._links['ec:asset'].href;
      const queryStrings = qs.parse(url.substr(url.indexOf('?') + 1));
      return () => this.asset(<string>queryStrings.assetID);
    });
  }

  /**
   * Create a new asset group.
   *
   * @param {object} group object representing the group.
   * @returns {Promise<AssetGroupResource>} the newly created AssetGroupResource
   */
  createAssetGroup(group: any): Promise<AssetGroupResource> {
    return <Promise<AssetGroupResource>>this.create('assetGroup', group);
  }

  /**
   * Create multiple new asset.
   *
   * @param {object|array<object|string>} input representing the asset, either an array of paths, a
   *   FormData object, a array of readStreams, or an array containing buffers.
   * @param {object?} options options for creating an asset.
   * @returns {Promise<Promise<AssetList>>} the newly created assets as AssetList
   */
  createAssets(input: Array<string | any> | any, options: assetOptions = {}) {
    if (!input) {
      return Promise.reject(new Error('Cannot create resource with undefined object.'));
    }

    return getUrl(this[environmentSymbol], this.newRequest().follow('ec:assets'))
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
          input.set('title', options.title);
        } else {
          superagentRequest.field('title', options.title);
        }
      }

      if (options.tags) {
        if (isFormData) {
          input.set('tags', options.tags);
        } else {
          options.tags.forEach((tag) => {
            superagentRequest.field('tags', tag);
          });
        }
      }

      return superagentPost(this[environmentSymbol], superagentRequest);
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
   * Create a new dm client.
   *
   * @param {object} client object representing the client.
   * @returns {Promise<DMClientResource>} the newly created DMClientResource
   */
  createClient(client: any): Promise<DMClientResource> {
    return <Promise<DMClientResource>>this.create('client', client);
  }

  /**
   * Create a new model.
   *
   * @param {object} model object representing the model.
   * @returns {Promise<ModelResource>} the newly created ModelResource
   */
  createModel(model: any): Promise<ModelResource> {
    return <Promise<ModelResource>>this.create('model', model);
  }

  /**
   * Create a new role.
   *
   * @param {object} role object representing the role.
   * @returns {Promise<RoleResource>} the newly created RoleResouce
   */
  createRole(role: any): Promise<RoleResource> {
    return <Promise<RoleResource>>this.create('role', role);
  }

  /**
   * Export this datamanager as postman collection.
   *
   * @returns {Promise<object>} The exported datamanager with collection and dataSchema.
   */
  export(): Promise<any> { // TODO advanced return type
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:datamananger/export');
      return get(this[environmentSymbol], request);
    })
    .then(([res]) => res);
  }

  /**
   * Get an {@link PublicAPI} instance for this DataManagerResource
   *
   * @returns {PublicAPI} PublicAPI instance
   */
  getPublicAPI(): PublicAPI {
    if (!this[apiSymbol]) {
      this[apiSymbol] = new PublicAPI(this.shortID, this[environmentSymbol], true);
    }
    return this[apiSymbol];
  }

  /**
   * Get a single {@link ModelResource} identified by modelID.
   *
   * @param {string} modelID id of the Model.
   * @returns {Promise<ModelResource>} resolves to the Model which should be loaded.
   */
  model(modelID: string): Promise<ModelResource> {
    return <Promise<ModelResource>>this.resource('model', modelID);
  }

  /**
   * Load a {@link ModelList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the
   *   filter options.
   * @returns {Promise<ModelList>} resolves to model list with applied filters.
   */
  modelList(options?: filterOptions): Promise<ModelList> {
    return <Promise<ModelList>>this.resourceList('model', options);
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
  role(roleID: string): Promise<RoleResource> {
    return <Promise<RoleResource>>this.resource('role', roleID);
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
  roleList(options: filterOptions): Promise<RoleList> {
    return <Promise<RoleList>>this.resourceList('role', options);
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
  stats(): Promise<DMStatsResource> {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:dm-stats');
      return get(this[environmentSymbol], request);
    })
    .then(([res]) => new DMStatsList(res, this[environmentSymbol]).getFirstItem());
  }
}

export default DataManagerResource;

export type assetOptions = {
  fileName?: string | Array<string>,
  title?: string,
  tags?: Array<string>
}
