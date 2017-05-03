import { Resource } from '../Resource';

export declare class DMAccountResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  accountID: string;

  hasPassword: boolean;
  mail: string;
  oauth: Array<any>;
}
