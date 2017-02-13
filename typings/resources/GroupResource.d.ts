import { Resource } from './Resource';

export declare class GroupResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  getGroupID(): string;

  getName(): string;

  setName(value: string): GroupResource;

  getPermissions(): Array<any>;

  setPermissions(value: Array<any>): GroupResource;

  addPermission(value: string): GroupResource;
}
