import * as stream from 'stream';

import { get, getUrl, optionsToQuery, superagentGetPiped } from '../../helper';
import ListResource from '../ListResource';
import AssetResource from './AssetResource';
import DeletedAssetList from './DeletedAssetList';
import DeletedAssetResource from './DeletedAssetResource';
import TagList from './TagList';
import TagResource from './TagResource';

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
    .then(([res, traversal]) => new DeletedAssetList(res, this.environment, traversal));
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
    .then(([res, traversal]) => new DeletedAssetResource(res, this.environment, traversal));
  }

  /**
   * Load the {@link TagList}.
   *
   * @example
   * return assetList.tagList()
   * .then(tags => {
   *   return tags.getAllItems().filter(tags => tag.tag === 'thisOne');
   * })
   * .then(tagsArray => {
   *   return show(tagsArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.tagList({
   *   filter: {
   *     assetID: 'thisOne',
   *   },
   * })
   * .then(tags => {
   *   return show(tags.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<TagList>} Promise resolving to TagList
   */
  tagList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this.dataManagerID;

      if (o && Object.keys(o).length === 2 && 'tag' in o && 'dataManagerID' in o) {
        throw new Error('Cannot filter tagList only by dataManagerID and tag. Use AssetList#tag() instead');
      }

      const request = this.newRequest()
      .follow('ec:tags/options')
      .withTemplateParameters(optionsToQuery(o));
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new TagList(res, this.environment, traversal));
  }

  /**
   * Load a single deleted {@link TagResource}.
   *
   * @example
   * return assetList.tag('thisOne')
   * .then(tag => {
   *   return show(tag);
   * });
   *
   * @param {string} tag the tag
   * @returns {Promise<TagResource>} Promise resolving to TagResource
   */
  tag(tag) {
    return Promise.resolve()
    .then(() => {
      if (!tag) {
        throw new Error('tag must be defined');
      }
      const request = this.newRequest()
      .follow('ec:tags/options')
      .withTemplateParameters({ dataManagerID: this.dataManagerID, tag });
      return get(this.environment, request);
    })
    .then(([res, traversal]) => new TagResource(res, this.environment, traversal));
  }

  /**
   * Download the contents of this {@link AssetList}. It will pipe the response to a writeable
   * stream if one is provided. Otherwise it will simply return the url where the assets can be
   * downloaded.
   *
   * @param {stream.Writable?} writeStream writable stream for direct downloading of zip file.
   * @returns {Promise<undefined>|string} Promise resolving undefined if writeable stream is
   * provided. Url otherwise.
   */
  download(writeStream) {
    if (writeStream && !(writeStream instanceof stream.Writable)) {
      return Promise.reject(new Error('writeStream must be instance of stream.Writable.'));
    }

    return getUrl(this.environment, this.newRequest().follow('ec:assets/download'))
    .then((url) => {
      if (writeStream) {
        return superagentGetPiped(url, writeStream);
      }

      return Promise.resolve(url);
    });
  }
}
