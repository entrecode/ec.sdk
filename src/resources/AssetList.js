import { get, optionsToQuery } from '../helper';
import ListResource from './ListResource';
import AssetResource from './AssetResource';

/**
 * Asset list class
 *
 * @class
 */
export default class AssetList extends ListResource {
  /**
   * Creates a new {@link AssetList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:asset', traversal);
    this.ListClass = AssetList;
    this.ItemClass = AssetResource;

    /* eslint no-underscore-dangle:0 */
    this.dataManagerID = resource._links.self.href.substr(resource._links.self.href.indexOf('dataManagerID') + 14);
    /* eslint no-underscore-dangle:1 */
  }

  /**
   * Load the {@link DeletedAssetList}.
   *
   * @example
   * return assetList.deletedAssetList()
   * .then(assets => {
   *   return assets.getAllItems().filter(asset => asset.assetID === 'thisOne');
   * })
   * .then(assetsArray => {
   *   return show(assetsArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.assetList({
   *   filter: {
   *     assetID: 'thisOne',
   *   },
   * })
   * .then(assets => {
   *   return show(assets.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<AssetList>} Promise resolving to AssetList
   */
  deletedAssetList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (o && Object.keys(o).length === 2 && 'assetID' in o && 'dataManagerID' in o) {
        throw new Error('Cannot filter deletedAssetList only by dataManagerID and assetID. Use AssetList#deletedAsset() instead');
      }

      const request = this.newRequest()
      .follow('ec:assets/deleted/options')
      .withTemplateParameters(optionsToQuery(o));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AssetList(res, this.environment, traversal));
  }

  /**
   * Load a single deleted {@link AssetResource}.
   *
   * @example
   * return assetList.deletedAsset('thisOne')
   * .then(asset => {
   *   return show(asset);
   * });
   *
   * @param {string} assetID the assetID
   * @returns {Promise<AssetResource>} Promise resolving to AssetResource
   */
  deletedAsset(assetID) {
    return Promise.resolve()
    .then(() => {
      if (!assetID) {
        throw new Error('assetID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:assets/deleted/options')
      .withTemplateParameters({ dataManagerID: this.dataManagerID, assetID });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new AssetResource(res, this.environment, traversal));
  }
}
