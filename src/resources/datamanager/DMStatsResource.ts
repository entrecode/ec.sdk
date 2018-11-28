import Resource from '../Resource';
import { environment } from '../../Core';

interface DMStatsResource {
  assetCount: number;
  config: any;
  dataManagerID: string;
  entryCount: number;
  fileCount: number;
  fileSize: number;
  modelCount: number;
  monthlyHooks: Array<any>;
  monthlyRequests: Array<any>;
  numberAccounts: number;
  numberHookRequests: Array<any>;
  numberRequests: number;
  templateVersion: string;
  templateID: string;
  templateName: string;
  title: string;
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
        enumerable: true,
        get: () => <number>this.getProperty('assetCount'),
      },
      config: {
        enumerable: true,
        get: () => <any>this.getProperty('config'),
      },
      dataManagerID: {
        enumerable: true,
        get: () => <string>this.getProperty('dataManagerID'),
      },
      entryCount: {
        enumerable: true,
        get: () => <number>this.getProperty('entryCount'),
      },
      fileCount: {
        enumerable: true,
        get: () => <number>this.getProperty('fileCount'),
      },
      fileSize: {
        enumerable: true,
        get: () => <number>this.getProperty('fileSize'),
      },
      modelCount: {
        enumerable: true,
        get: () => <number>this.getProperty('modelCount'),
      },
      monthlyHooks: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('monthlyHooks'),
      },
      monthlyRequests: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('monthlyRequests'),
      },
      numberAccounts: {
        enumerable: true,
        get: () => <number>this.getProperty('numberAccounts'),
      },
      numberHookRequests: {
        enumerable: true,
        get: () => <number>this.getProperty('numberHookRequests'),
      },
      numberRequests: {
        enumerable: true,
        get: () => <number>this.getProperty('numberRequests'),
      },
      templateID: {
        enumerable: true,
        get: () => <string>this.getProperty('templateID'),
      },
      templateName: {
        enumerable: true,
        get: () => <string>this.getProperty('templateName'),
      },
      templateVersion: {
        enumerable: true,
        get: () => <string>this.getProperty('templateVersion'),
      },
      title: {
        enumerable: true,
        get: () => <string>this.getProperty('title'),
      },
    });
    this.countProperties();
  }
}

export default DMStatsResource;
