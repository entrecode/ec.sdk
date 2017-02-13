import { Core } from './Core';
import { AccountList } from './resources/AccountList';
import { AccountResource } from './resources/AccountResource';
import { filterOptions } from './interfaces';
import { InvitesResource } from './resources/InvitesResource';
import { ClientList } from './resources/ClientList';
import { ClientResrouce } from './resources/ClientResrouce';
import { InvalidPermissionsResource } from './resources/InvalidPermissionsResource';

export declare class Accounts extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Accounts;

  list(options?: filterOptions): Promise<AccountList>;

  get(accountID: string): Promise<AccountResource>;

  me(): Promise<AccountResource>;

  createApiToken(): tokenResponse;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  changeEmail(email: string): Promise<undefined>;

  createInvites(count: number): Promise<InvitesResource>;

  invites(): Promise<InvitesResource>

  clientList(options?: filterOptions): Promise<ClientList>;

  client(clientID: string): Promise<ClientResrouce>;

  invalidPermissions(): Promise<InvalidPermissionsResource>;
}

interface tokenResponse {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
