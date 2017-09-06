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

  get assetCount() {
    return <number>this.getProperty('assetCount');
  }

  get config() {
    return <any>this.getProperty('config');
  }

  get dataManagerID() {
    return <string>this.getProperty('dataManagerID');
  }

  get entryCount() {
    return <number>this.getProperty('entryCount');
  }

  get fileCount() {
    return <number>this.getProperty('fileCount');
  }

  get fileSize() {
    return <number>this.getProperty('fileSize');
  }

  get modelCount() {
    return <number>this.getProperty('modelCount');
  }

  get monthlyHooks() {
    return <Array<any>>this.getProperty('monthlyHooks');
  }

  get monthlyRequests() {
    return <Array<any>>this.getProperty('monthlyRequests');
  }

  get numberAccounts() {
    return <number>this.getProperty('numberAccounts');
  }

  get numberHookRequests() {
    return <number>this.getProperty('numberHookRequests');
  }

  get numberRequests() {
    return <number>this.getProperty('numberRequests');
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

  get title() {
    return <string>this.getProperty('title');
  }
}
