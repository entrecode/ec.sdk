import { Resource } from './Resource';

export declare class TemplateResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  templateID: string;

  name: string;
  collection: Object;
  dataSchema: Object;
  version: Object;
}
