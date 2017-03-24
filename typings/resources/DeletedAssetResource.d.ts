import { Resource } from './Resource';


export declare class DeletedAssetResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  assetID: string;
  title: string;
  tags: Array<string>;
  created: Date;
  type: string;
  files: Array<any>;
}
