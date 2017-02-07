import { Resource } from './Resource';
import { filterOptions } from '../interfaces';
import { ModelList } from './ModelList';
import { ModelResource } from './ModelResource';

export declare class DataManagerResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  modelList(options: filterOptions): ModelList

  model(modelID: string): ModelResource;

  getDataManagerID(): string;

  setTitle(value: string): DataManagerResource;

  getTitle(): string;

  setDescription(value: string): DataManagerResource;

  getDescription(): string;

  setConfig(value: any): DataManagerResource;

  getconfig(): any;

  setHexColor(value: string): DataManagerResource;

  getHexColor(): string;

  setLocales(value: Array<string>): DataManagerResource;

  getLocales(): Array<string>;
}
