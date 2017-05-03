import { Resource } from '../Resource';

export declare class InvalidPermissionsResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  invalidAccountPermissions: Array<any>;
  invalidGroupPermissions: Array<any>;
}
