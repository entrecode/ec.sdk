import ListResource from '../ListResource';
import { environment } from '../../Core';
import DMAssetResource from './DMAssetResource';
import DMAssetList from './DMAssetList';

const relationsSymbol = Symbol.for('relations');

/**
 * AssetGroup list class
 *
 * @class
 */
export default class AssetGroupList extends ListResource {
  /**
   * Creates a new {@link AssetGroupList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-assetgroup', undefined, DMAssetList, DMAssetResource);

    this[relationsSymbol] = {
      assets: {
        relation: 'ec:dm-assets',
        createRelation: false,
        createTemplateModifier: '',
        id: 'assetID',
        ResourceClass: DMAssetResource,
        ListClass: DMAssetList,
      },
    };
  }
}
