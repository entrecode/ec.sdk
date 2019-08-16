interface DMStatsResource {
  assetCount: number;
  config: any;
  dataManagerID: string;
  entryCount: number;
  fileSize: number;
  lAssetCount: number;
  lFileCount: number;
  lFileSize: number;
  modelCount: number;
  numberAccounts: number;
  numberRequests: number;
  requestStats: Array<any>;
  templateID: string;
  templateName: string;
  templateVersion: string;
  title: string;
}

const resourceSymbol: any = Symbol.for('resource');
const resourcePropertiesSymbol: any = Symbol.for('resourceProperties');

/**
 * DMStatsResource class
 *
 * @class
 *
 * @prop {array<object>} dataManagerID - the dataManagerID
 */
class DMStatsResource {
  /**
   * Creates a new {@link DMStatsResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any) {
    this[resourceSymbol] = JSON.parse(JSON.stringify(resource));

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
      fileSize: {
        enumerable: true,
        get: () => <number>this.getProperty('fileSize'),
      },
      lAssetCount: {
        enumerable: true,
        get: () => <number>this.getProperty('lAssetCount'),
      },
      lFileCount: {
        enumerable: true,
        get: () => <number>this.getProperty('lFileCount'),
      },
      lFileSize: {
        enumerable: true,
        get: () => <number>this.getProperty('lFileSize'),
      },
      modelCount: {
        enumerable: true,
        get: () => <number>this.getProperty('modelCount'),
      },
      numberAccounts: {
        enumerable: true,
        get: () => <number>this.getProperty('numberAccounts'),
      },
      numberRequests: {
        enumerable: true,
        get: () => <number>this.getProperty('numberRequests'),
      },
      requestStats: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('requestStats'),
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

  /**
   * Will return a single selected property identified by property.
   *
   * @private
   *
   * @param {string} property the selected property name.
   * @returns {*} the property which was selected.
   */
  getProperty(property: string): any {
    if (!property) {
      throw new Error('Property name cannot be undefined');
    }

    return this[resourceSymbol][property];
  }

  countProperties(): void {
    this[resourcePropertiesSymbol] = Object.keys(this);
  }
}

export default DMStatsResource;
