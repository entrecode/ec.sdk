import { Resource } from '../Resource';
import { DataManagerResource } from './DataManagerResource';

export declare class TemplateResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  templateID: string;

  name: string;
  collection: Object;
  dataSchema: Object;
  version: Object;

  createDM(): Promise<DataManagerResource>;

  updateDM(dataManagerID: string): Promise<DataManagerResource>;
}
