import { Resource } from '../Resource';

export declare class TagResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  tag: string;
  count: number;
}
