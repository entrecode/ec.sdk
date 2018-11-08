import ListResource, { filterOptions } from '../ListResource';
import PublicAssetResource from './PublicAssetResource';
import PublicTagList from './PublicTagList';
import PublicTagResource from './PublicTagResource';
import { get, optionsToQuery } from '../../helper';
import { environment } from '../../Core';

const environmentSymbol: any = Symbol.for('environment');

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:api/asset', undefined, PublicAssetList, PublicAssetResource);
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
  tag(tag: string): Promise<PublicTagResource> {
    return Promise.resolve()
      .then(() => {
        if (!tag) {
          throw new Error('tag must be defined');
        }
        const request = this.newRequest()
          .follow('ec:api/tags')
          .withTemplateParameters({ tag });
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new PublicTagResource(res, this[environmentSymbol], traversal));
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
  tagList(options?: filterOptions | any): Promise<PublicTagList> { // TODO remove any
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
          .withTemplateParameters(optionsToQuery(options, this.getLink('ec:api/tags').href));
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new PublicTagList(res, this[environmentSymbol], traversal));
  }
}
