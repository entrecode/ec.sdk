import * as stream from 'stream';

import AssetResource from './AssetResource';
import DeletedAssetList from './DeletedAssetList';
import DeletedAssetResource from './DeletedAssetResource';
import ListResource, { filterOptions } from '../ListResource';
import TagList from './TagList';
import TagResource from './TagResource';
import { get, getUrl, optionsToQuery, superagentGetPiped } from '../../helper';
import { environment } from '../../Core';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');
const dataManagerIDSymbol = Symbol('dataManagerID');
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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:asset', undefined, AssetList, AssetResource);

    /* eslint no-underscore-dangle:0 */
    this[dataManagerIDSymbol] = resource._links.self.href.substr(resource._links.self.href.indexOf('dataManagerID') + 14);
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
   * @returns {Promise<DeletedAssetList>} Promise resolving to AssetList
   */
  deletedAssetList(options: filterOptions): Promise<DeletedAssetList> {
    return Promise.resolve()
    .then(() => {
      const o: filterOptions | any = {}; // TODO remove any
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this[dataManagerIDSymbol];

      if (
        Object.keys(o).length === 2 && 'assetID' in o && 'dataManagerID' in o
        && (typeof o.assetID === 'string' || (!('any' in o.assetID) && !('all' in o.assetID)))
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
      ) {
        throw new Error('Cannot filter deletedAssetList only by dataManagerID and assetID. Use AssetList#deletedAsset() instead');
      }

      const request = this.newRequest()
      .follow('ec:assets/deleted/options')
      .withTemplateParameters(optionsToQuery(o, this.getLink('ec:assets/deleted/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeletedAssetList(res, this[environmentSymbol], traversal));
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
   * @returns {Promise<DeletedAssetResource>} Promise resolving to AssetResource
   */
  deletedAsset(assetID: string): Promise<DeletedAssetResource> {
    return Promise.resolve()
    .then(() => {
      if (!assetID) {
        throw new Error('assetID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:assets/deleted/options')
      .withTemplateParameters({ dataManagerID: this[dataManagerIDSymbol], assetID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeletedAssetResource(res, this[environmentSymbol], traversal));
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
  tagList(options: filterOptions): Promise<TagList> {
    return Promise.resolve()
    .then(() => {
      const o: filterOptions | any = {}; // TODO remove any
      if (options) {
        Object.assign(o, options);
      }

      o.dataManagerID = this[dataManagerIDSymbol];

      if (
        Object.keys(o).length === 2 && 'tag' in o && 'dataManagerID' in o
        && (typeof o.tag === 'string' || (!('any' in o.tag) && !('all' in o.tag)))
        && (typeof o.dataManagerID === 'string' || (!('any' in o.dataManagerID) && !('all' in o.dataManagerID)))
      ) {
        throw new Error('Cannot filter tagList only by dataManagerID and tag. Use AssetList#tag() instead');
      }

      const request = this.newRequest()
      .follow('ec:tags/options')
      .withTemplateParameters(optionsToQuery(o, this.getLink('ec:tags/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TagList(res, this[environmentSymbol], traversal));
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
  tag(tag: string): Promise<TagResource> {
    return Promise.resolve()
    .then(() => {
      if (!tag) {
        throw new Error('tag must be defined');
      }
      const request = this.newRequest()
      .follow('ec:tags/options')
      .withTemplateParameters({ dataManagerID: this[dataManagerIDSymbol], tag });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TagResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Download the contents of this {@link AssetList}. It will pipe the response to a writeable
   * stream if one is provided. Otherwise it will simply return the url where the assets can be
   * downloaded.
   *
   * @param {stream.Writable?} writeStream writable stream for direct downloading of zip file.
   * @returns {Promise<void|string>} Promise resolving undefined if writeable stream is
   * provided. Url otherwise.
   */
  download(writeStream?: stream): Promise<void> {
    if (writeStream && !(writeStream instanceof stream.Writable)) {
      return Promise.reject(new Error('writeStream must be instance of stream.Writable.'));
    }

    return getUrl(this[environmentSymbol], this.newRequest().follow('ec:assets/download'))
    .then((url) => {
      if (writeStream) {
        return superagentGetPiped(url, writeStream);
      }

      return Promise.resolve(url);
    });
  }
}
