import { Resource } from './Resource';

export declare class GroupResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  groupID: string;

  name: string;
  permissions: Array<any>;

  addPermission(value: string): GroupResource;
}
