import { get, optionsToQuery } from '../../helper';
import { environmentSymbol, resourceSymbol } from '../Resource';
import ListResource from '../ListResource';
import PublicAssetResource from './PublicAssetResource';
import TagList from './PublicTagList';
import TagResource from './PublicTagResource';

const dataManagerIDSymbol = Symbol('_dataManagerID');
/**
 * PublicAsset list class
 *
 * @class
 */
export default class PublicAssetList extends ListResource {
  /**
   * Creates a new {@link PublicAssetList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal, 'ec:api/assets', undefined, PublicAssetList, PublicAssetResource);
  }

  /**
   * Load the {@link PublicTagList}.
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
   * @returns {Promise<PublicTagList>} Promise resolving to PublicTagList
   */
  tagList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options &&
        Object.keys(options).length === 1 && 'tag' in options
        && (typeof options.tag === 'string' || (!('any' in options.tag) && !('all' in options.tag)))
      ) {
        throw new Error('Cannot filter tagList only by tag. Use PublicAssetList#tag() instead');
      }

      const request = this.newRequest()
      .follow('ec:api/tags')
      .withTemplateParameters(optionsToQuery(options, this[resourceSymbol].link('ec:api/tags').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TagList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link PublicTagResource}.
   *
   * @example
   * return assetList.tag('thisOne')
   * .then(tag => {
   *   return show(tag);
   * });
   *
   * @param {string} tag the tag
   * @returns {Promise<PublicTagResource>} Promise resolving to PublicTagResource
   */
  tag(tag) {
    return Promise.resolve()
    .then(() => {
      if (!tag) {
        throw new Error('tag must be defined');
      }
      const request = this.newRequest()
      .follow('ec:api/tags')
      .withTemplateParameters({ dataManagerID: this[dataManagerIDSymbol], tag });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TagResource(res, this[environmentSymbol], traversal));
  }
}
