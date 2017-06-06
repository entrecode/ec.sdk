import { Resource } from '../Resource';

export declare class TargetResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  targetID: string;
  config: any;
  targetType: string;
}
