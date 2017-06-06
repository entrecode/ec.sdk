import { Resource } from '../Resource';
import { filterOptions } from '../../interfaces';

export declare class BuildResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  buildID: string;
  started: Date;
  finished: Date;
  successful: string;
  buildLocation: any;
  events: Array<any>;
}
