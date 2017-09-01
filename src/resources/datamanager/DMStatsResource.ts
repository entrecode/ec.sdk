import Resource from '../Resource';
import { environment } from '../ListResource';

/**
 * DMStatsResource class
 *
 * @class
 *
 * @prop {array<object>} dataManagerID - the dataManagerID
 */
export default class DMStatsResource extends Resource {
  dataManagerID: string;
  title: string;
  config: any;
  templateID: string;
  templateName: string;
  templateVersion: string;
  modelCount: number;
  entryCount: number;
  assetCount: number;
  fileCount: number;
  fileSize: number;
  numberAccounts: number;
  numberRequests: number;
  numberHookRequests: number;
  monthlyRequests: Array<any>;
  monthlyHooks: Array<any>;

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
      dataManagerID: {
        enumerable: true,
        get: () => this.getProperty('dataManagerID'),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
      },
      templateID: {
        enumerable: true,
        get: () => this.getProperty('templateID'),
      },
      templateName: {
        enumerable: true,
        get: () => this.getProperty('templateName'),
      },
      templateVersion: {
        enumerable: true,
        get: () => this.getProperty('templateVersion'),
      },
      modelCount: {
        enumerable: true,
        get: () => this.getProperty('modelCount'),
      },
      entryCount: {
        enumerable: true,
        get: () => this.getProperty('entryCount'),
      },
      assetCount: {
        enumerable: true,
        get: () => this.getProperty('assetCount'),
      },
      fileCount: {
        enumerable: true,
        get: () => this.getProperty('fileCount'),
      },
      fileSize: {
        enumerable: true,
        get: () => this.getProperty('fileSize'),
      },
      numberAccounts: {
        enumerable: true,
        get: () => this.getProperty('numberAccounts'),
      },
      numberRequests: {
        enumerable: true,
        get: () => this.getProperty('numberRequests'),
      },
      numberHookRequests: {
        enumerable: true,
        get: () => this.getProperty('numberHookRequests'),
      },
      monthlyRequests: {
        enumerable: true,
        get: () => this.getProperty('monthlyRequests'),
      },
      monthlyHooks: {
        enumerable: true,
        get: () => this.getProperty('monthlyHooks'),
      },
    });
    this.countProperties();
  }
}
