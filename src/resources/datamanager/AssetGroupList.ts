import ListResource from '../ListResource';
import { environment } from '../../types';
import AssetGroupResource from './AssetGroupResource';

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
    super(resource, environment, traversal, 'ec:dm-assetgroup', undefined, AssetGroupList, AssetGroupResource);
  }
}
