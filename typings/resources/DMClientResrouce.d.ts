import { ClientResrouce } from './ClientResrouce';

export declare class DMClientResrouce extends ClientResrouce {
  constructor(resource: any, environment: string, traversal?: any);

  clientID: string;

  callbackURL: string;
  hexColor: string;
  disableStrategies: Array<string>;
}
