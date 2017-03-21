import Resource from './Resource';

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
  constructor(resource, environment, traversal) {
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
  }
}
