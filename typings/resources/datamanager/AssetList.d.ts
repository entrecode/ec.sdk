import * as stream from 'stream';
import { ListResource } from '../ListResource';
import { filterOptions } from '../../interfaces';
import { DeletedAssetList } from './DeletedAssetList';
import { DeletedAssetResource } from './DeletedAssetResource';
import { TagList } from './TagList';
import { TagResource } from './TagResource';

export declare class AssetList extends ListResource {
  constructor(resource: any, environment: string, traversal?: any);

  deletedAssetList(options?: filterOptions): DeletedAssetList;

  deletedAsset(assetID: string): DeletedAssetResource;

  tagList(options?: filterOptions): TagList;

  tag(tag: string): TagResource;

  download(writeStream: stream.Writable): Promise<void> | string;
}
