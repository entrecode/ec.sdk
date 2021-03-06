import DeletedAssetResource from './DeletedAssetResource';
import ListResource from '../ListResource';
import { environment } from '../../Core';

/**
 * Asset list class
 *
 * @class
 */
export default class DeletedAssetList extends ListResource {
  /**
   * Creates a new {@link DeletedAssetList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:asset/deleted', undefined, DeletedAssetList, DeletedAssetResource);
  }
}
