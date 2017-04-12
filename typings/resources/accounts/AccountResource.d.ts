import { Resource } from '../Resource';
import { TokenList } from './TokenList';

export declare class AccountResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  accountID: string;

  groups: Array<any>;
  hasPassword: boolean;
  hasPendingEmail: boolean;
  language: string;
  name: string;
  mail: string;
  openID: Array<any>;
  permissions: Array<string>;
  state: string;

  getAllPermissions(): Array<string>;

  addPermission(value: string): AccountResource;

  tokenList(): Promise<TokenList>;
}
