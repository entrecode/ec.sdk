import { Resource } from '../Resource';

export declare class CodeSourceResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  codeSourceID: string;
  config: any;
  codeSourceType: string;
}
