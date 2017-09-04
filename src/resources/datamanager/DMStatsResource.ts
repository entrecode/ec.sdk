import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * DMStatsResource class
 *
 * @class
 *
 * @prop {array<object>} dataManagerID - the dataManagerID
 */
export default class DMStatsResource extends Resource {
  /**
   * Creates a new {@link DMStatsResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this.countProperties();
  }

  get dataManagerID() {
    return <string>this.getProperty('dataManagerID');
  }

  get title() {
    return <string>this.getProperty('title');
  }

  get config() {
    return <any>this.getProperty('config');
  }

  get templateID() {
    return <string>this.getProperty('templateID');
  }

  get templateName() {
    return <string>this.getProperty('templateName');
  }

  get templateVersion() {
    return <string>this.getProperty('templateVersion');
  }

  get modelCount() {
    return <number>this.getProperty('modelCount');
  }

  get entryCount() {
    return <number>this.getProperty('entryCount');
  }

  get assetCount() {
    return <number>this.getProperty('assetCount');
  }

  get fileCount() {
    return <number>this.getProperty('fileCount');
  }

  get fileSize() {
    return <number>this.getProperty('fileSize');
  }

  get numberAccounts() {
    return <number>this.getProperty('numberAccounts');
  }

  get numberRequests() {
    return <number>this.getProperty('numberRequests');
  }

  get numberHookRequests() {
    return <number>this.getProperty('numberHookRequests');
  }

  get monthlyRequests() {
    return <Array<any>>this.getProperty('monthlyRequests');
  }

  get monthlyHooks() {
    return <Array<any>>this.getProperty('monthlyHooks');
  }
}
