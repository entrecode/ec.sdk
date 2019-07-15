import Resource from '../Resource';
import { environment } from '../../Core';
import DMAssetList from '../publicAPI/DMAssetList';
import { filterOptions } from '../ListResource';
import DMAssetResource from '../publicAPI/DMAssetResource';

const relationsSymbol: any = Symbol.for('relations');

interface AssetGroupResource {
  assetGroupID: string;
  policies: any;
  public: boolean;
  settings: any;
}

/**
 * AssetGroupResource class
 *
 * @class
 *
 * @prop {string}        tokenID - The id of this asset
 * @prop {string}        title   - The title of this asset
 * @prop {array<string>} tags    - array of tags
 * @prop {Date}          created - Timestamp when this asset was created
 * @prop {string}        type    - type of this asset, like image
 * @prop {array<object>} files   - all files associated with this asset
 */
class AssetGroupResource extends Resource {
  /**
   * Creates a new {@link AssetGroupResource}.
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
      assetGroupID: {
        enumerable: true,
        get: () => <string>this.getProperty('assetGroupID'),
      },
      policies: {
        enumerable: true,
        get: () => <any>this.getProperty('policies'),
        set: (value: any) => this.setProperty('policies', value),
      },
      public: {
        enumerable: true,
        get: () => <boolean>this.getProperty('public'),
      },
      settings: {
        enumerable: true,
        get: () => <any>this.getProperty('settings'),
        set: (value: any) => this.setProperty('settings', value),
      },
    });
    this.countProperties();

    this[relationsSymbol] = {
      dmAsset: {
        relation: 'ec:dm-assets',
        createRelation: false,
        createTemplateModifier: '',
        id: 'assetID',
        ResourceClass: DMAssetResource,
        singleIsList: true,
        ListClass: DMAssetList,
      },
    };
  }

  /**
   * Load a single {@link DMAssetResource}.
   *
   *
   * @param {string} assetID the id
   * @returns {Promise<DMAssetResource>} Promise resolving to DMAssetResource
   */
  asset(assetID: string): Promise<DMAssetResource> {
    return <Promise<DMAssetResource>>this.resource('dmAsset', assetID);
  }

  /**
   * Load the {@link DMAssetList}.
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMAssetList>} Promise resolving to DMAssetList
   */
  assetList(options: filterOptions | any = {}): Promise<DMAssetList> {
    return <Promise<DMAssetList>>this.resourceList('dmAsset', options);
  }
}

export default AssetGroupResource;
