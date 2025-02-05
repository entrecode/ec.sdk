import * as ShiroTrie from 'shiro-trie';

import Resource from '../Resource';
import TokenList from './TokenList';
import { environment } from '../../Core';
import TokenResource from './TokenResource';
// eslint-disable-next-line import/no-cycle
import { tokenResponse } from '../../Accounts';
import { post } from '../../helper';

const relationsSymbol: any = Symbol.for('relations');
const environmentSymbol: any = Symbol.for('environment');

export type AccountType = 'Person' | 'Client' | 'API Key';

interface AccountResource {
  accountID: string;
  type: AccountType | null;
  created: Date;
  email: string;
  name: string;
  company: string | null;
  preferredUsername: string | null;
  givenName: string | null;
  middleName: string | null;
  familyName: string | null;
  nickname: string | null;
  birthdate: Date | null;
  gender: string | null;
  picture: string | null;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  address: {
    streetAddress: string | null;
    locality: string | null;
    postalCode: string | null;
    region: string | null;
    country: string | null;
    formatted: string | null;
  };
  language: string;
  locale: string | null;
  zoneinfo: string | null;
  state: string;
  hasPassword: boolean;
  hasTOTP: boolean;
  hasAuthenticators: Array<{ id: string; type: string }>;
  hasFallbackCodes: number;
  hasPendingEmail: boolean;
  mfaRequired: boolean;
  authenticatorRequires2FA: boolean;
  legacyLoginDisabled: boolean;
  openID: Array<any> | undefined;
  permissions: Array<string> | undefined;
  nativePermissions: Array<string> | undefined;
  groups: Array<any>;
  lastLogin: Date;
}

/**
 * Account resource class
 *
 * @class
 *
 * @prop {string}         accountID         - The id of the Account
 * @prop {string}         type              - The type of the account
 * @prop {Date}           created           - The {@link Date} on which this account was created
 * @prop {string}         email             - The current email. Can be changed with {@link Accounts#changeEmail}
 * @prop {string}         name              - The current name.
 * @prop {string}         company           - The current company.
 * @prop {string}         preferredUsername - The current preferredUsername.
 * @prop {string}         givenName         - The current givenName.
 * @prop {string}         middleName        - The current middleName.
 * @prop {string}         familyName        - The current familyName.
 * @prop {string}         nickname          - The current nickname.
 * @prop {Date}           birthdate         - The current birthdate.
 * @prop {string}         gender            - The current gender (f|m|d)
 * @prop {string}         picture           - The current picture url
 * @prop {string}         phoneNumber       - The current phoneNumber
 * @prop {boolean}        phoneNumberVerified - Whether or not the phoneNumber is verified
 * @prop {object}         address           - The current address
 * @prop {string}         address.streetAddress - The current streetAddress
 * @prop {string}         address.locality  - The current locality
 * @prop {string}         address.postalCode - The current postalCode
 * @prop {string}         address.region    - The current region
 * @prop {string}         address.country   - The current country
 * @prop {string}         address.formatted - The current formatted address
 * @prop {string}         language          - The language for frontend usage
 * @prop {string}         locale            - The locale for frontend usage
 * @prop {string}         zoneinfo          - The zoneinfo for frontend usage
 * @prop {string}         state             - State of the account.
 * @prop {boolean}        hasTOTP           - Whether or not this account has TOTP enabled
 * @prop {Array<object>}  hasAuthenticators - Array of authenticators this account has enabled
 * @prop {number}         hasFallbackCodes  - Number of fallback codes this account has
 * @prop {boolean}        mfaRequired       - Whether or not this account requires MFA
 * @prop {boolean}        authenticatorRequires2FA - Whether or not this account requires 2FA
 * @prop {boolean}        legacyLoginDisabled - Whether or not this account has legacy login disabled
 * @prop {Array<object> | undefined} openID            - Array of connected openID accounts
 * @prop {Array<string> | undefined}  permissions       - Array of all permissions
 * @prop {Array<string> | undefined}  nativePermissions - Array of native permissions
 * @prop {Array<object>}  groups            - Array of groups this account is member of
 * @prop {Date}           lastLogin         - The {@link Date} on which this account was last logged in
 */
class AccountResource extends Resource {
  /**
   * Creates a new {@link AccountResource}.
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
      token: {
        relation: 'ec:account/tokens/options',
        createRelation: false,
        createTemplateModifier: '',
        id: 'accessTokenID',
        additionalTemplateParam: 'accountID',
        ResourceClass: TokenResource,
        ListClass: TokenList,
      },
    };

    Object.defineProperties(this, {
      accountID: {
        enumerable: true,
        get: () => <string>this.getProperty('accountID'),
      },
      type: {
        enumerable: true,
        get: () => this.getProperty('type'),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      email: {
        enumerable: true,
        get: () => this.getProperty('email'),
      },
      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
        set: (value) => {
          this.setProperty('name', value);
          return value;
        },
      },
      company: {
        enumerable: true,
        get: () => this.getProperty('company'),
        set: (value) => {
          this.setProperty('company', value);
          return value;
        },
      },
      preferredUsername: {
        enumerable: true,
        get: () => this.getProperty('preferredUsername'),
        set: (value) => {
          this.setProperty('preferredUsername', value);
          return value;
        },
      },
      givenName: {
        enumerable: true,
        get: () => this.getProperty('givenName'),
        set: (value) => {
          this.setProperty('givenName', value);
          return value;
        },
      },
      middleName: {
        enumerable: true,
        get: () => this.getProperty('middleName'),
        set: (value) => {
          this.setProperty('middleName', value);
          return value;
        },
      },
      familyName: {
        enumerable: true,
        get: () => this.getProperty('familyName'),
        set: (value) => {
          this.setProperty('familyName', value);
          return value;
        },
      },
      nickname: {
        enumerable: true,
        get: () => this.getProperty('nickname'),
        set: (value) => {
          this.setProperty('nickname', value);
          return value;
        },
      },
      birthdate: {
        enumerable: true,
        get: () => this.getProperty('birthdate'),
        set: (value) => {
          this.setProperty('birthdate', value);
          return value;
        },
      },
      gender: {
        enumerable: true,
        get: () => this.getProperty('gender'),
        set: (value) => {
          this.setProperty('gender', value);
          return value;
        },
      },
      picture: {
        enumerable: true,
        get: () => this.getProperty('picture'),
        set: (value) => {
          this.setProperty('picture', value);
          return value;
        },
      },
      phoneNumber: {
        enumerable: true,
        get: () => this.getProperty('phoneNumber'),
        set: (value) => {
          this.setProperty('phoneNumber', value);
          return value;
        },
      },
      address: {
        enumerable: true,
        get: () => this.getProperty('address'),
        set: (value) => {
          this.setProperty('address', value);
          return value;
        },
      },
      language: {
        enumerable: true,
        get: () => this.getProperty('language'),
        set: (value) => {
          this.setProperty('language', value);
          return value;
        },
      },
      locale: {
        enumerable: true,
        get: () => this.getProperty('locale'),
        set: (value) => {
          this.setProperty('locale', value);
          return value;
        },
      },
      zoneinfo: {
        enumerable: true,
        get: () => this.getProperty('zoneinfo'),
        set: (value) => {
          this.setProperty('zoneinfo', value);
          return value;
        },
      },
      state: {
        enumerable: true,
        get: () => this.getProperty('state'),
        set: (value) => {
          this.setProperty('state', value);
          return value;
        },
      },
      hasPassword: {
        enumerable: true,
        get: () => this.getProperty('hasPassword'),
      },
      hasTOTP: {
        enumerable: true,
        get: () => this.getProperty('hasTOTP'),
      },
      hasAuthenticators: {
        enumerable: true,
        get: () => this.getProperty('hasAuthenticators'),
      },
      hasFallbackCodes: {
        enumerable: true,
        get: () => this.getProperty('hasFallbackCodes'),
      },
      hasPendingEmail: {
        enumerable: true,
        get: () => this.getProperty('hasPendingEmail'),
      },
      mfaRequired: {
        enumerable: true,
        get: () => this.getProperty('mfaRequired'),
      },
      authenticatorRequires2FA: {
        enumerable: true,
        get: () => this.getProperty('authenticatorRequires2FA'),
      },
      legacyLoginDisabled: {
        enumerable: true,
        get: () => this.getProperty('legacyLoginDisabled'),
      },
      openID: {
        enumerable: true,
        get: () => {
          if (!this.getProperty('openID')) {
            throw new Error('AccountResource loaded from AccountList, please call `await AccountResource#resolve()`.');
          }

          return this.getProperty('openID');
        },
        set: (value) => {
          this.setProperty('openID', value);
          return value;
        },
      },
      permissions: {
        enumerable: true,
        get: () => {
          if (!this.getProperty('permissions')) {
            throw new Error('AccountResource loaded from AccountList, please call `await AccountResource#resolve()`.');
          }

          return <Array<string>>this.getProperty('permissions');
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set: (_value: Array<string>) => {
          // eslint-disable-next-line no-console
          console.warn(
            'set on AccountResource#permissions is deprecated. Use AccountResource#nativePermissions instead.',
          );
        },
      },
      nativePermissions: {
        enumerable: true,
        get: () => {
          if (!this.getProperty('nativePermissions')) {
            throw new Error('AccountResource loaded from AccountList, please call `await AccountResource#resolve()`.');
          }

          return <Array<string>>this.getProperty('nativePermissions');
        },
        set: (value: Array<string>) => {
          this.setProperty('nativePermissions', value);
          return value;
        },
      },
      groups: {
        enumerable: false,
        get: () => this.getProperty('groups'),
      },
      lastLogin: {
        enumerable: true,
        get: () => new Date(this.getProperty('lastLogin')),
      },
    });
    this.countProperties();
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermission(value: string): AccountResource {
    if (!value) {
      throw new Error('permission must be defined');
    }

    return this.addPermissions([value]);
  }

  /**
   * Adds new permissions to permissions array.
   *
   * @param {Array<string>} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermissions(value: Array<string>): AccountResource {
    if (!value || !Array.isArray(value)) {
      throw new Error('permission must be defined');
    }

    let current = this.nativePermissions as Array<string>;
    current = current.concat(value);
    this.nativePermissions = current;
    return this;
  }

  /**
   * Remove a single permission from this account.
   *
   * @param {string} value the permission to remove
   * @returns {AccountResource} returns this account resource
   */
  removePermission(value: string): AccountResource {
    if (!value) {
      throw new Error('permission must be defined');
    }

    return this.removePermissions([value]);
  }

  /**
   * Remove multiple permissions from this account.
   *
   * @param {Array<string>} value the permissions to remove
   * @returns {AccountResource} returns this account resource
   */
  removePermissions(value: Array<string>) {
    if (!value || !Array.isArray(value)) {
      throw new Error('permission must be defined and an array');
    }

    let current = this.nativePermissions as Array<string>;
    current = current.filter((permission) => value.indexOf(permission) !== -1);
    this.nativePermissions = current;
    return this;
  }

  /**
   * Check if this Account has a given permission
   *
   * @param {string} permission the permission to check
   * @returns {boolean} true if the Account has this permission, false otherwise
   */
  checkPermission(permission: string): boolean {
    if (!permission) {
      throw new Error('permission must be defined');
    }

    if (!this.nativePermissions) {
      throw new Error('AccountResource loaded from AccountList, please call `await AccountResource#resolve()`.');
    }

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const trie = ShiroTrie['new']();
    trie.add(this.permissions);

    return trie.check(permission);
  }

  /**
   * Queries the Accounts permissions. See [shiro-trie](https://www.npmjs.com/package/shiro-trie).
   *
   * @param {string} query the permission string to be queried
   * @returns {Array<string>} an array of available permissions
   */
  queryPermissions(query: String): Array<string> {
    if (!query) {
      throw new Error('query musst be defined');
    }

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const trie = ShiroTrie['new']();
    trie.add(this.permissions);

    return trie.permissions(query);
  }

  /**
   * Returns an array of all permissions of this account. The array will contain the account
   * permissions and all group permissions.
   *
   * @deprecated Since Account Server 1.2.0 this is the same as {@link AccountResource#permissions}
   *
   * @returns {array<string>} All permissions.
   */
  getAllPermissions(): Array<string> {
    return this.permissions as Array<string>;
  }

  /**
   * Load the {@link TokenList} for this account
   *
   * @returns {Promise<TokenList>} Promise resolving the token list
   */
  tokenList(): Promise<TokenList> {
    return <Promise<TokenList>>this.resourceList('token');
  }

  /**
   * Create an additional access token {@link tokenResponse} for this account.
   * Only supported for API Keys.
   *
   * @example
   * return account.createToken()
   * .then(({ jwt, accountID, iat, exp}) => {
   *   // do something with `jwt` because it is not accessable later
   * });
   *
   * @returns {Promise<{jwt: string, accountID: string, iat: number, exp: number}>} the created api
   *   token response.
   * @throws {Error} if the account is not an API Key
   */
  createToken(): Promise<tokenResponse> {
    if (this.email || this.hasPassword || this.state !== 'active') {
      throw new Error('Cannot create token for this account. Only API Token Accounts can get an addtional token.');
    }
    return this.follow('ec:account/tokens')
      .then((request) => post(this[environmentSymbol], request))
      .then(([r]) => r);
  }

  /**
   * Saves this {@link AccountResource}.
   *
   * @returns {Promise<AccountResource>} Promise will resolve to the saved AccountResource. Will
   *   be the same object but with refreshed data.
   */
  save(): Promise<AccountResource> {
    if (!this.getProperty('nativePermissions')) {
      throw new Error('AccountResource loaded from AccountList, please call `await AccountResource#resolve()`.');
    }

    this.setProperty('permissions', undefined);
    return <Promise<AccountResource>>super.save(false, `${this.getLink('self').profile}-template`);
  }
}

export default AccountResource;
