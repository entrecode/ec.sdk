import Resource from './Resource';
import TokenList from './TokenList';
import { get } from '../helper';

/**
 * Account resource class
 *
 * @class
 */
export default class AccountResource extends Resource {
  /**
   * Will return created property.
   *
   * @returns {Date} the create date.
   */
  getCreated() {
    return new Date(this.getProperty('created'));
  }

  /**
   * Will return accountID property.
   *
   * @returns {string} the accountID.
   */
  getAccountID() {
    return this.getProperty('accountID');
  }

  /**
   * Will return name property.
   *
   * @returns {string} the name.
   */
  getName() {
    return this.getProperty('name');
  }

  /**
   * Will return email property.
   *
   * @returns {string} the email.
   */
  getEmail() {
    return this.getProperty('email');
  }

  /**
   * Will return groups property.
   *
   * @returns {array<object>} the groups array.
   */
  getGroups() {
    return this.getProperty('groups');
  }

  /**
   * Will return language property.
   *
   * @returns {string} the language.
   */
  getLanguage() {
    return this.getProperty('language');
  }

  /**
   * Will return stage property.
   *
   * @returns {string} the state.
   */
  getState() {
    return this.getProperty('state');
  }

  /**
   * Will return openID property.
   *
   * @returns {array<openID>} the openID array.
   */
  getOpenID() {
    return this.getProperty('openID');
  }

  /**
   * Will return permissions property.
   *
   * @returns {array<string>} the config.
   */
  getPermissions() {
    return this.getProperty('permissions');
  }

  /**
   * Returns an array of all permissions of this account. The array will contain the account
   * permissions and all group permissions.
   *
   * @returns {array<string>} All permissions.
   */
  getAllPermissions() {
    return this.getProperty('groups')
    .map(g => g.permissions)
    .reduce((all, current) => all.concat(current), this.getPermissions());
  }

  /**
   * Set a new value to language property.
   *
   * @param {string} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setLanguage(value) {
    if (!value) {
      throw new Error('Language must be defined');
    }

    return this.setProperty('language', value);
  }

  /**
   * Set a new value to state property.
   *
   * @param {string} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setState(value) {
    if (!value) {
      throw new Error('State must be defined');
    }

    return this.setProperty('state', value);
  }

  /**
   * Set a new value to openID property.
   *
   * @param {array<openID>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setOpenID(value) {
    if (!value) {
      throw new Error('openID must be defined');
    }

    return this.setProperty('openID', value);
  }

  /**
   * Set a new value to permissions property.
   *
   * @param {array<string>} value the value to assign.
   * @returns {AccountResource} this Resource for chainability
   */
  setPermissions(value) {
    if (!value) {
      throw new Error('Permissions must be defined');
    }

    return this.setProperty('permissions', value);
  }

  /**
   * Adds a new permission to permissions array.
   *
   * @param {string} value the permission to add.
   * @returns {AccountResource} this Resource for chainability
   */
  addPermission(value) {
    if (!value) {
      throw new Error('permission must be defined');
    }

    const current = this.getPermissions();
    current.push(value);
    return this.setPermissions(current);
  }

  /**
   * Check if this account has a password. Will be false on openID only and API key accounts.
   *
   * @returns {boolean} whether or not this account has a password.
   */
  hasPassword() {
    return this.getProperty('hasPassword');
  }

  /**
   * Check if this account has a pending email.
   *
   * @returns {array<openID>} whether or not the account has a pending email.
   */
  hasPendingEmail() {
    return this.getProperty('hasPendingEmail');
  }

  /**
   * Load the {@link TokenList} for this account
   *
   * @returns {Promise<TokenList>} Promise resolving the token list
   */
  tokenList() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest().follow('ec:account/tokens');

      return get(this.environment, request)
      .then(([tokenList, traversal]) => new TokenList(tokenList, this.environment, traversal));
    });
  }
}

/**
 * Object describing openID connections.
 *
 * @typedef {{sub: string, iss: string, pending: boolean, email: string, name: string}} openID
 */
