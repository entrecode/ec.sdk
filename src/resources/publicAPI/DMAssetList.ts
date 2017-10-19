import ListResource from '../ListResource';
import { environment } from '../../Core';
import DMAssetResource from './DMAssetResource';

/**
 * Asset list class
 *
 * @class
 */
export default class DMAssetList extends ListResource {
  /**
   * Creates a new {@link DMAssetList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:dm-asset', undefined, DMAssetList, DMAssetResource);
  }
}
