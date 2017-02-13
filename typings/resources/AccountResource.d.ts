import { Resource } from './Resource';
import { TokenList } from './TokenList';

export declare class AccountResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  getAccountID(): string;

  getName(): string;

  getEmail(): string;

  getGroups(): Array<any>;

  getLanguage(): string;

  getState(): string;

  getOpenID(): Array<any>;

  getPermissions(): Array<string>;

  getAllPermissions(): Array<string>;

  setLanguage(value: string): AccountResource;

  setState(value: string): AccountResource;

  setOpenID(value: Array<any>): AccountResource;

  setPermissions(value: Array<string>): AccountResource;

  addPermission(value: string): AccountResource;

  hasPassword(): boolean;

  hasPendingEmail(): boolean

  tokenList(): Promise<TokenList>;
}
