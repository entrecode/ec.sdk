import Resource from '../Resource';
import { environment } from '../../Core';
import DMAssetList from '../publicAPI/DMAssetList';
import { filterOptions } from '../ListResource';
import DMAssetResource from '../publicAPI/DMAssetResource';

const relationsSymbol = Symbol.for('relations');

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
export default class AssetGroupResource extends Resource {
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
    this.countProperties();

    this[relationsSymbol] = {
      asset: {
        relation: 'ec:dm-assets',
        createRelation: false,
        createTemplateModifier: '',
        id: 'assetID',
        ResourceClass: DMAssetResource,
        ListClass: DMAssetList,
      },
    };
  }

  get assetGroupID() {
    return <string>this.getProperty('assetGroupID');
  }

  get public() {
    return <boolean>this.getProperty('public');
  }

  get settings() {
    return <any>this.getProperty('settings');
  }

  set settings(value: any) {
    this.setProperty('settings', value);
  }

  get policies() {
    return <any>this.getProperty('policies');
  }

  set policies(value: any) {
    this.setProperty('policies', value);
  }

  /**
   * Load a single {@link DMAssetResource}.
   *
   *
   * @param {string} assetID the id
   * @returns {Promise<DMAssetResource>} Promise resolving to DMAssetResource
   */
  asset(assetID: string): Promise<DMAssetResource> {
    return <Promise<DMAssetResource>>this.resource('asset', assetID);
  }

  /**
   * Load the {@link DMAssetList}.
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<DMAssetList>} Promise resolving to DMAssetList
   */
  assetList(options: filterOptions | any = {}): Promise<DMAssetList> {
    return <Promise<DMAssetList>>this.resourceList('asset', options);
  }
}
