import { Core } from './Core';
import { AccountList } from './resources/AccountList';
import { AccountResource } from './resources/AccountResource';
import { filterOptions } from './interfaces';
import { InvitesResource } from './resources/InvitesResource';
import { ClientList } from './resources/ClientList';
import { ClientResrouce } from './resources/ClientResource';
import { InvalidPermissionsResource } from './resources/InvalidPermissionsResource';
import { GroupResource } from './resources/GroupResource';
import { GroupList } from './resources/GroupList';

export declare class Accounts extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Accounts;

  accountList(options?: filterOptions): Promise<AccountList>;

  account(accountID: string): Promise<AccountResource>;

  me(): Promise<AccountResource>;

  groupList(options?: filterOptions): Promise<GroupList>;

  group(groupID: string): Promise<GroupResource>;

  clientList(options?: filterOptions): Promise<ClientList>;

  client(clientID: string): Promise<ClientResrouce>;

  createApiToken(): tokenResponse;

  invites(): Promise<InvitesResource>

  createInvites(count: number): Promise<InvitesResource>;

  invalidPermissions(): Promise<InvalidPermissionsResource>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  changeEmail(email: string): Promise<undefined>;
}

interface tokenResponse {
  token: string;
  accountID: string;
  iat: number;
  exp: number
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
