import Resource from '../Resource';
import { environment } from '../../Core';

interface DMStatsResource {
  assetCount: number,
  config: any,
  dataManagerID: string,
  entryCount: number,
  fileCount: number,
  fileSize: number,
  modelCount: number,
  monthlyHooks: Array<any>,
  monthlyRequests: Array<any>,
  numberAccounts: number,
  numberHookRequests: Array<any>,
  numberRequests: number,
  templateVersion: string,
  templateID: string,
  templateName: string,
  title: string,
}

/**
 * DMStatsResource class
 *
 * @class
 *
 * @prop {array<object>} dataManagerID - the dataManagerID
 */
class DMStatsResource extends Resource {
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
    Object.defineProperties(this, {
      assetCount: {
        get: () => <number>this.getProperty('assetCount'),
      },
      config: {
        get: () => <any>this.getProperty('config'),
      },
      dataManagerID: {
        get: () => <string>this.getProperty('dataManagerID'),
      },
      entryCount: {
        get: () => <number>this.getProperty('entryCount'),
      },
      fileCount: {
        get: () => <number>this.getProperty('fileCount'),
      },
      fileSize: {
        get: () => <number>this.getProperty('fileSize'),
      },
      modelCount: {
        get: () => <number>this.getProperty('modelCount'),
      },
      monthlyHooks: {
        get: () => <Array<any>>this.getProperty('monthlyHooks'),
      },
      monthlyRequests: {
        get: () => <Array<any>>this.getProperty('monthlyRequests'),
      },
      numberAccounts: {
        get: () => <number>this.getProperty('numberAccounts'),
      },
      numberHookRequests: {
        get: () => <number>this.getProperty('numberHookRequests'),
      },
      numberRequests: {
        get: () => <number>this.getProperty('numberRequests'),
      },
      templateID: {
        get: () => <string>this.getProperty('templateID'),
      },
      templateName: {
        get: () => <string>this.getProperty('templateName'),
      },
      templateVersion: {
        get: () => <string>this.getProperty('templateVersion'),
      },
      title: {
        get: () => <string>this.getProperty('title'),
      },
    });
    this.countProperties();
  }
}

export default DMStatsResource;
