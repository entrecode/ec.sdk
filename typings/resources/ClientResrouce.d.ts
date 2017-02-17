import { Resource } from './Resource';

export declare class ClientResrouce extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  clientID: string;

  callbackURL: string;
  config: any;
}
