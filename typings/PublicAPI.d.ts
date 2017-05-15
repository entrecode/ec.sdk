import { Core } from './Core';
import { filterOptions } from './interfaces';
import { EntryList } from './resources/publicAPI/EntryList';
import { EntryResource } from './resources/publicAPI/EntryResource';

export declare class PublicAPI extends Core {
  constructor(id: string, environment?: environment);

  resolve(reload: boolean): PublicAPI;

  modelList(): any;

  setClientID(clientID: string): PublicAPI;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  createAnonymous(validUntil: Date): Promise<any>;

  me(): Promise<any>;

  getSchema(model: string, method?: string): Promise<any>;

  entryList(model: string, options?: filterOptions): Promise<EntryList>;

  entry(model:string, id: string): Promise<EntryResource>;

  createEntry(model:string, entry: any): Promise<EntryResource>;

  checkPermission(permission): Promise<boolean>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
