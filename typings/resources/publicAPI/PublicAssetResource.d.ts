import { Resource } from '../Resource';

export declare class PublicAssetResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  isResolved: boolean;

  assetID: string;
  title: string;
  tags: Array<string>;
  created: Date;
  type: string;
  files: Array<any>;

  resolve(): Promise<PublicAssetResource>;

  getFileUrl(locale?: string): string;

  getImageUrl(size?: number): string;

  getImageThumbUrl(size?: number): string;
}
