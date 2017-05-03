import { Core } from './Core';

export declare class Session extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Session;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  checkPermission(permission: string): Promise<boolean>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
