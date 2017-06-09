import { Core } from './Core';
import { environment } from './interfaces';

export declare class Session extends Core {
  constructor(environment?: environment);

  setClientID(clientID: string): Session;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  checkPermission(permission: string): Promise<boolean>;
}
