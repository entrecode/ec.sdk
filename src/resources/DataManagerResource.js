import { get, post, optionsToQuery } from '../helper';
import ModelList from './ModelList';
import ModelResource from './ModelResource';
import DMClientList from './DMClientList';
import DMClientResource from './DMClientResource';
import DMAccountList from './DMAccountList';
import DMAccountResource from './DMAccountResource';
import Resource from './Resource';

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

      if (Object.keys(o).length === 2 && 'dataManagerID' in o && 'modelID' in o) {
        throw new Error('Cannot filter modelList only by dataManagerID and modelID. Use DataManagerResource#model() instead.');
      }

      return get(
        this.environment,
        this.newRequest().follow('ec:models/options').withTemplateParameters(optionsToQuery(o))
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

      if (o && Object.keys(o).length === 2 && 'clientID' in o && 'dataManagerID' in o) {
        throw new Error('Cannot filter clientList only by dataManagerID and clientID. Use DataManagerResource#client() instead');
      }

      const request = this.newRequest()
      .follow('ec:dm-clients/options')
      .withTemplateParameters(optionsToQuery(o));
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

      if (o && Object.keys(o).length === 2 && 'accountID' in o && 'dataManagerID' in o) {
        throw new Error('Cannot filter accountList only by dataManagerID and accountID. Use DataManagerResource#account() instead');
      }

      const request = this.newRequest()
      .follow('ec:dm-account/options')
      .withTemplateParameters(optionsToQuery(o));
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
}
