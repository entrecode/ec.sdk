import { Resource } from '../Resource';


export declare class AppResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  appID: string;
  shortID: string;
  title: string;
  hexColor: string;
  created: Date;
}
