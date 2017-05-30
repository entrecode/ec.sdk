import { Resource } from '../Resource';

export declare class PlatformResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  platformID: string;
  title: string;
  config: any;
  platformType: string;
}
