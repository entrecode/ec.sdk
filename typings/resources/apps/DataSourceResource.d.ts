import { Resource } from '../Resource';

export declare class DataSourceResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  dataSourceID: string;
  config: any;
  dataSourceType: string;
}
