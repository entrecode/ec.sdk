import { Core } from './Core';
import { AccountList } from './resources/AccountList';
import { AccountResource } from './resources/AccountResource';
import { filterOptions } from './interfaces';
import { InvitesResource } from './resources/InvitesResource';

export declare class Accounts extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Accounts;

  list(options?: filterOptions): Promise<AccountList>;

  get(accountID: string): Promise<AccountResource>;

  createApiToken(): tokenResponse;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  changeEmail(email: string): Promise<undefined>;

  createInvites(count: number): Promise<InvitesResource>;

  invites(): Promise<InvitesResource>
}

interface tokenResponse {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
