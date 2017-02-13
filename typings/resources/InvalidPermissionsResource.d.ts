import { Resource } from './Resource';

export declare class InvalidPermissionsResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  getInvalidAccountPermissions(): Array<any>;

  getInvalidGroupPermissions(): Array<any>;
}
