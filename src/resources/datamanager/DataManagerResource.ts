import { environment } from '../../types';
import PublicAPI from '../../PublicAPI';
import { get, optionsToQuery } from '../../helper';
import { FilterOptions } from '../ListResource';
import Resource from '../Resource';
import HistoryEvents from '../publicAPI/HistoryEvents';
import AssetGroupList from './AssetGroupList';
import AssetGroupResource from './AssetGroupResource';
import DMAccountList from './DMAccountList';
import DMAccountResource from './DMAccountResource';
import DMClientList from './DMClientList';
import DMClientResource from './DMClientResource';
import DMStatsList from './DMStatsList';
import DMStatsResource from './DMStatsResource';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import RoleList from './RoleList';
import RoleResource from './RoleResource';

const environmentSymbol: any = Symbol.for('environment');
const apiSymbol: any = Symbol('api');
const relationsSymbol: any = Symbol.for('relations');

interface DataManagerResource {
  config: any;
  created: any;
  dataManagerID: string;
  template: string;
  description: string;
  hexColor: string;
  locales: Array<string>;
  shortID: string;
  title: string;
  defaultLocale: string;
  publicAssetRights: Array<string>;
  rights: Array<string>;
}

/**
 * DataManager resource class.
 *
 * @class
 *
 * @prop {string}         dataManagerID     - The id of the dataManager
 * @prop {string}         template          - The templateID from which this dataManager was created
 * @prop {object}         config            - The dataManager config
 * @prop {Date}           created           - The Date this dataManager was created
 * @prop {string}         description       - The description
 * @prop {string}         hexColor          - The hexColor for frontend usage
 * @prop {Array<string>}  locales           - Array of available locales
 * @prop {string}         shortID           - Shortened {@link DataManager#dataManagerID}
 * @prop {string}         title             - Title of the dataManager
 * @prop {string}         defaultLocale     - Default locale for this dataManager
 * @prop {Array<string>}  publicAssetRights - right for public legacy assets
 * @prop {Array<string>}  right             - really old rights, deprecated
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
      dmAccount: {
        relation: 'ec:dm-accounts/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accountID',
        additionalTemplateParam: 'dataManagerID',
        ResourceClass: DMAccountResource,
        ListClass: DMAccountList,
      },
      dmClient: {
        relation: 'ec:dm-clients/options',
        createRelation: 'ec:dm-client/by-id',
        createTemplateModifier: '',
        id: 'clientID',
        additionalTemplateParam: 'dataManagerID',
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
        createTemplateModifier: '-template-post',
        id: 'roleID',
        additionalTemplateParam: 'dataManagerID',
        ResourceClass: RoleResource,
        ListClass: RoleList,
      },
      assetGroup: {
        relation: 'ec:dm-assetgroups',
        createRelation: 'ec:dm-assetgroup/by-id',
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
      template: {
        enumerable: true,
        get: () => <string>this.getProperty('template'),
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
        get: () => <Array<string>>this.getProperty('locales'),
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
      },
      defaultLocale: {
        enumerable: true,
        get: () => <string>this.getProperty('defaultLocale'),
        set: (value: string) => this.setProperty('defaultLocale', value),
      },
      publicAssetRights: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('publicAssetRights'),
        set: (value: Array<string>) => this.setProperty('publicAssetRights', value),
      },
      rights: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('rights'),
        set: (value: Array<string>) => this.setProperty('rights', value),
      },
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
    return <Promise<DMAccountResource>>this.resource('dmAccount', accountID);
  }

  /**
   * Load a {@link DMAccountList} of {@link DMAccountResource} filtered by the values specified
   * by the options parameter.
   *
   * @example
   * return dm.accountList({
   *   created: {
   *     from: new Date(new Date.getTime() - 600000).toISOString()),
   *   },
   * })
   * .then((list) => {
   *   return show(list);
   * })
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<DMAccountList>} resolves to account list with applied filters.
   */
  accountList(options?: FilterOptions): Promise<DMAccountList> {
    return <Promise<DMAccountList>>this.resourceList('dmAccount', options, { dataManagerID: this.dataManagerID });
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
  assetGroupList(options: FilterOptions | any = {}): Promise<AssetGroupList> {
    return Promise.resolve().then(() => {
      return <Promise<AssetGroupList>>this.resourceList('assetGroup', options);
    });
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
    return <Promise<DMClientResource>>this.resource('dmClient', clientID);
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
  clientList(options?: FilterOptions): Promise<DMClientList> {
    return <Promise<DMClientList>>this.resourceList('dmClient', options);
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
   * Create a new dm client.
   *
   * @param {object} client object representing the client.
   * @returns {Promise<DMClientResource>} the newly created DMClientResource
   */
  createClient(client: any): Promise<DMClientResource> {
    return <Promise<DMClientResource>>this.create('dmClient', client);
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
  export(): Promise<any> {
    // TODO advanced return type
    return Promise.resolve()
      .then(() => {
        const request = this.newRequest().follow('ec:datamanager/export');
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
  modelList(options?: FilterOptions): Promise<ModelList> {
    return <Promise<ModelList>>this.resourceList('model', options);
  }

  /**
   * Load the HistoryEvents for this DataManager from v3 API.
   * Note: This Request only has pagination when you load a single modelID.
   *
   * @param {filterOptions | any} options The filter options
   * @returns {Promise<HistoryEvents} The filtered HistoryEvents
   */
  getEvents(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:datamanager/history'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new HistoryEvents(res, this[environmentSymbol], traversal));
  }

  /*
  /**
   * Creates a new History EventSource with the given filter options.
   *
   * @deprecated
   * 
   * @param {filterOptions | any} options The filter options
   * @return {Promise<EventSource>} The created EventSource.
   */
  /*
  newHistory(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:datamanager/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return getHistory(this[environmentSymbol], request);
      });
  }

  /**
   * Creates a new HistoryEventsResource with past events.
   *
   * @deprecated
   * 
   * @param {filterOptions?} options The filter options.
   * @returns {Promise<HistoryEventsResource} Event list of past events.
   */
  /*
  getPastEvents(options?: FilterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:datamanager/dm-entryHistory'))
      .then((request) => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res]) => new HistoryEvents(res, this[environmentSymbol]));
  }
  */

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
  roleList(options: FilterOptions): Promise<RoleList> {
    return <Promise<RoleList>>this.resourceList('role', options);
  }

  /**
   * Invoke this to recreate public api documentation for this datamangager. DataManager will respond with 202 Accepted upon successful request so this simply resolves undefined.
   *
   * @returns {undefined} returns undefined.
   */
  rebuildDoc(): Promise<void> {
    return Promise.resolve()
      .then(() => {
        const request = this.newRequest().follow('ec:api-doc/build');
        return get(this[environmentSymbol], request);
      })
      .then(([res]) => undefined);
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
        const request = this.newRequest().follow('ec:dm-stats');
        return get(this[environmentSymbol], request);
      })
      .then(([res]) => new DMStatsList(res, this[environmentSymbol]).getFirstItem());
  }
}

export default DataManagerResource;

export type assetOptions = {
  fileName?: string | Array<string>;
  title?: string;
  tags?: Array<string>;
};
