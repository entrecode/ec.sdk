import { Core } from './Core';
import { AccountList } from './resources/accounts/AccountList';
import { AccountResource } from './resources/accounts/AccountResource';
import { environment, filterOptions } from './interfaces';
import { InvitesResource } from './resources/accounts/InvitesResource';
import { ClientList } from './resources/accounts/ClientList';
import { ClientResource } from './resources/accounts/ClientResource';
import { InvalidPermissionsResource } from './resources/accounts/InvalidPermissionsResource';
import { GroupResource } from './resources/accounts/GroupResource';
import { GroupList } from './resources/accounts/GroupList';

export declare class Accounts extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Accounts;

  accountList(options?: filterOptions): Promise<AccountList>;

  account(accountID: string): Promise<AccountResource>;

  me(): Promise<AccountResource>;

  groupList(options?: filterOptions): Promise<GroupList>;

  group(groupID: string): Promise<GroupResource>;

  createGroup(group: any): Promise<GroupResource>;

  clientList(options?: filterOptions): Promise<ClientList>;

  client(clientID: string): Promise<ClientResource>;

  createClient(client: any): Promise<ClientResource>;

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
