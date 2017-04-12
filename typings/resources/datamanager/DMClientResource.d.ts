import { ClientResource } from '../accounts/ClientResource';

export declare class DMClientResource extends ClientResource {
  constructor(resource: any, environment: string, traversal?: any);

  clientID: string;

  callbackURL: string;
  hexColor: string;
  disableStrategies: Array<string>;
}
