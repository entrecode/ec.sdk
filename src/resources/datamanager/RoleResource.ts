import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * Role resource class
 *
 * @class
 *
 * @prop {string} roleID - The id of the role
 * @prop {stirng} name - The name of the role
 * @prop {string} label - A label for the role
 * @prop {boolean} addUnregistered - Whether or not to add unregistered users to this role
 * @prop {boolean} addRegistered - Whether or not to add registered users to this role
 * @prop {array<string>} accounts - array of accountIDs associated to this role
 */
export default class RoleResource extends Resource {
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
    this.countProperties();
  }

  get accounts() {
    return <Array<string>>this.getProperty('accounts')
  }

  set accounts(value: Array<string>) {
    this.setProperty('accounts', value);
  }

  get addRegistered() {
    return <boolean>this.getProperty('addRegistered');
  }

  set addRegistered(value: boolean) {
    this.setProperty('addRegistered', value);
  }

  get addUnregistered() {
    return <boolean>this.getProperty('addUnregistered')
  }

  set addUnregistered(value: boolean) {
    this.setProperty('addUnregistered', value);
  }

  get label() {
    return <string>this.getProperty('label');
  }

  set label(value: string) {
    this.setProperty('label', value);
  }

  get name() {
    return <string>this.getProperty('name');
  }

  set name(value: string) {
    this.setProperty('name', value);
  }

  get roleID() {
    return <string>this.getProperty('roleID');
  }
}
