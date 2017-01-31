import { Core } from './Core';
import { AccountList } from './resources/AccountList';
import { AccountResource } from './resources/AccountResource';
import { filterOptions } from './interfaces';

export declare class Accounts extends Core {
  constructor(environment?: string);

  setClientID(clientID: string): Accounts;

  list(options?: filterOptions): Promise<AccountList>;

  get(accountID: string): Promise<AccountResource>;

  createApiToken(): tokenResponse;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;
}

interface tokenResponse {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}
