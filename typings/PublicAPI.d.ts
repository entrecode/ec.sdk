import { Core } from './Core';

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
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
