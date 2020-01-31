import * as querystring from 'querystring';

import Resource from '../Resource';
import { environment } from '../../Core';
import RoleResource from './RoleResource';
import LiteRoleResource from '../publicAPI/LiteRoleResource';
import { filterOptions } from '../ListResource';
import {
  get,
  optionsToQuery,
} from '../../helper';
import DMAuthTokenList from '../publicAPI/DMAuthTokenList';
import DMAuthTokenResource from '../publicAPI/DMAuthTokenResource';

const resourceSymbol: any = Symbol.for('resource');
const environmentSymbol: any = Symbol.for('environment');
const relationsSymbol: any = Symbol.for('relations');

interface DMAccountResource {
  title: string;
  accountID: string;
  email: string;
  hasPassword: boolean;
  oauth: Array<any>;
  pending: boolean;
  blocked: boolean;
  pendingUpdated: Date;
  created: Date;
  roles: Array<LiteRoleResource>;
}

/**
 * DM Account resource class
 *
 * @class
 *
 * @prop {string} accountID The id of the Account
 * @prop {string} email The current email.
 * @prop {boolean} hasPassword Whether or not this account has a password
 * @prop {Array<string>} oauth Array of connected oauth accounts
 * @prop {boolean} pending wheter or not this account is in pending state
 * @prop {boolean} blocked wheter or not this account is blocked
 * @prop {Date} pendingUpdated Date on which pending state got updated
 * @prop {Date} created Date on which this account was created
 * @prop {Array<LiteRoleResource>} roles Roles this account is member of
 */
class DMAccountResource extends Resource {
  /**
   * Creates a new {@link DMAccountResource}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this[relationsSymbol] = {
      authTokens: {
        relation: 'ec:dm-authtokens',
        createRelation: false,
        createTemplateModifier: '',
        id: 'hash',
        ResourceClass: DMAuthTokenResource,
        ListClass: DMAuthTokenList,
      }
    };
    Object.defineProperties(this, {
      accountID: {
        enumerable: true,
        get: () => <string>this.getProperty('accountID'),
      },
      email: {
        enumerable: true,
        get: () => <string>this.getProperty('email'),
      },
      hasPassword: {
        enumerable: true,
        get: () => <boolean>this.getProperty('hasPassword'),
      },
      oauth: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('oauth'),
      },
      pending: {
        enumerable: true,
        get: () => <boolean>this.getProperty('pending'),
      },
      blocked: {
        enumerable: true,
        get: () => <boolean>this.getProperty('blocked'),
        set: (blocked: boolean) => {
          this.setProperty('blocked', blocked);
          return blocked;
        },
      },
      pendingUpdated: {
        enumerable: true,
        get: () => new Date(this.getProperty('pendingUpdated')),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      roles: {
        enumerable: false,
        get: () => {
          const roles = this[resourceSymbol].linkArray('ec:dm-role') || [];
          return roles.map((role) => {
            return new LiteRoleResource(role, this[environmentSymbol]);
          });
        },
        set: (roles: Array<String | RoleResource | LiteRoleResource>) => {
          if (!roles) {
            throw new Error('roles must be defined');
          }

          if (!Array.isArray(roles)) {
            throw new Error('roles must be an array');
          }

          const links = roles.map((role) => {
            if (typeof role !== 'string' && !(typeof role === 'object' && 'roleID' in role)) {
              throw new Error('roles items must be string or role like object');
            }

            if (role instanceof RoleResource || role instanceof LiteRoleResource) {
              const link = role.getLink('self');
              if (link) {
                return link;
              }
            }

            const baseLink = this.getLink('self').href.split('account?')[0];
            return {
              href: `${baseLink}role?${querystring.stringify({ dataManagerID: this.dataManagerID, roleID: role })}`,
            };
          });

          this[resourceSymbol]._links['ec:dm-role'] = links;

          return roles;
        },
      },
    });
    Object.defineProperty(this, 'title', {
      enumerable: true,
      get: () => this.email || this.accountID,
    });
    this.countProperties();
  }

  /**
   * Load the active sessions for this acccount - the {@link DMAuthTokenList}.
   *
   * @example
   * const tokenList = await account.tokenList();
   * await tokenList.map((token) => {
   *    console.log(`${token.created}: ${token.device} (${token.near})`);
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMAuthTokenList>} Promise resolving to DMAuthTokenList
   */
  tokenList(options?: filterOptions | any): Promise<DMAuthTokenList> {
    // TODO remove any 
    return Promise.resolve()
      .then(() => {
        return this.follow('ec:dm-authtokens');
      })
      .then((request) => {
        request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:dm-authtokens').href));
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new DMAuthTokenList(res, this[environmentSymbol], traversal));
  }

  private get dataManagerID() {
    const self = this.getLink('self');
    const qs = querystring.parse(self.href.split('?')[1]);
    return qs.dataManagerID;
  }
}

export default DMAccountResource;
