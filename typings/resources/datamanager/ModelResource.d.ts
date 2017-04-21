import { Resource } from '../Resource';

export declare class ModelResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  modelID: string;

  created: Date;
  description: string;
  fields: Array<any>; // TODO field type
  hasEntries: boolean;
  hexColor: string;
  hooks: Array<any>; // TODO field type
  locales: Array<string>;
  modified: Date;
  policies: Array<any>;
  title: string;
  titleField: string;
}
