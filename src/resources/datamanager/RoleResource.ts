import Resource from '../Resource';
import { environment } from '../../Core';
import DMAccountResource from './DMAccountResource';
import DMAccountList from './DMAccountList';
import LiteDMAccountResource from '../publicAPI/LiteDMAccountResource';
import { filterOptions } from '../ListResource';

const relationsSymbol: any = Symbol.for('relations');

interface RoleResource {
  accountsCount: number;
  accounts: Array<LiteDMAccountResource>;
  addRegistered: boolean;
  addUnregistered: boolean;
  label: string;
  name: string;
  roleID: string;
}

/**
 * Role resource class
 *
 * @class
 *
 * @prop {string} roleID - The id of the role
 * @prop {string} name - The name of the role
 * @prop {string} label - A label for the role
 * @prop {number} accountsCount - Number of accounts in this role
 * @prop {boolean} addUnregistered - Whether or not to add unregistered users to this role
 * @prop {boolean} addRegistered - Whether or not to add registered users to this role
 * @prop {array<LiteDMAccountResource>} accounts - array of accountIDs associated to this role
 */
class RoleResource extends Resource {
  /**
   * Creates a new {@link RoleResource}.
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
        relation: 'ec:dm-accounts',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accountID',
        additionalTemplateParam: false,
        ResourceClass: DMAccountResource,
        ListClass: DMAccountList,
      },
    };

    Object.defineProperties(this, {
      accountsCount: {
        enumerable: true,
        get: () => <number>this.getProperty('accountsCount'),
      },
      addRegistered: {
        enumerable: true,
        get: () => <boolean>this.getProperty('addRegistered'),
        set: (value: boolean) => this.setProperty('addRegistered', value),
      },
      addUnregistered: {
        enumerable: true,
        get: () => <boolean>this.getProperty('addUnregistered'),
        set: (value: boolean) => this.setProperty('addUnregistered', value),
      },
      label: {
        enumerable: true,
        get: () => <string>this.getProperty('label'),
        set: (value: string) => this.setProperty('label', value),
      },
      name: {
        enumerable: true,
        get: () => <string>this.getProperty('name'),
        set: (value: string) => this.setProperty('name', value),
      },
      roleID: {
        enumerable: true,
        get: () => <string>this.getProperty('roleID'),
      },
    });
    this.countProperties();
  }

  /**
   * Load the {@link DMAccountList} of {@link DMAccountResource} for this role.
   *
   * @example
   * return role.accountList({
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
   accountList(options?: filterOptions): Promise<DMAccountList> {
     return <Promise<DMAccountList>>this.resourceList('dmAccount', options);
   }
}

export default RoleResource;
