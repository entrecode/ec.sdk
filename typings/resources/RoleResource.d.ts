import { Resource } from './Resource';

export declare class RoleResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  roleID: string;

  name: string;
  label: string;
  addUnregistered: boolean;
  addRegistered: boolean;
  accounts: Array<string>;
}
