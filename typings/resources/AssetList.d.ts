import { ListResource } from './ListResource';
import { filterOptions } from '../interfaces';
import { DeletedAssetList } from './DeletedAssetList';
import { DeletedAssetResource } from './DeletedAssetResource';


export declare class AssetList extends ListResource {
  constructor(resource: any, environment: string, traversal?: any);

  deletedAssetList(options?: filterOptions): DeletedAssetList;

  deletedAsset(assetID: string): DeletedAssetResource;
}
