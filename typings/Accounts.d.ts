import { Core } from './Core';
import { AccountList } from './resource/AccountList';
import { AccountResource } from './resource/AccountResource';
import { filterOptions } from './interfaces';

export declare class Accounts extends Core {
  constructor(environment?: string);

  setClientID(clientID: string): Accounts;

  list(options?: filterOptions): Promise<AccountList>;

  get(accountID: string): Promise<AccountResource>;

  createApiToken(): tokenResponse;

  login(email: string, password: string): Promise<string>;
}

interface tokenResponse {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}
