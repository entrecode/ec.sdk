import { Resource } from './Resource';


export declare class AssetResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  assetID: string;
  title: string;
  tags: Array<string>;
  created: Date;
  type: string;
  files: Array<any>;

  getFileUrl(locale?: string): string;
  getImageUrl(size?: number): string;
  getImageThumbUrl(size?: number): string;
}
