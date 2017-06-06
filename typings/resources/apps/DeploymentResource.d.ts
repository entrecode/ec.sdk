import { Resource } from '../Resource';

export declare class DeploymentResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  deploymentID: string;
  buildID: string;
  platformID: string;
  targetIDs: Array<string>;
  started: Date;
  finished: Date;
  successful: string;
  events: Array<any>;
  results: Array<any>;
}
