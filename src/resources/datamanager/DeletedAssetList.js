import ListResource from '../ListResource';
import DeletedAssetResource from './DeletedAssetResource';

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
  constructor(resource, environment, traversal) {
    super(resource, environment, 'ec:asset/deleted', traversal, DeletedAssetList, DeletedAssetResource);
  }
}
