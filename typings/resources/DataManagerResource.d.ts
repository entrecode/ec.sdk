import { Resource } from './Resource';
import { filterOptions } from '../interfaces';
import { ModelList } from './ModelList';
import { ModelResource } from './ModelResource';

export declare class DataManagerResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  dataManagerID: string;

  config: any;
  description: string;
  hexColor: string;
  locales: Array<string>;
  title: string;

  modelList(options?: filterOptions): ModelList

  model(modelID: string): ModelResource;
}
