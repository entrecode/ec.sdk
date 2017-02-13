import { Resource } from './Resource';

export declare class ClientResrouce extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  getClientID(): string;

  getCallbackURL(): string;

  getConfig(): any;

  setCallbackURL(value: string): ClientResrouce;

  setConfig(value: any): ClientResrouce;
}
