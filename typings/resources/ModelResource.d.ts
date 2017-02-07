import { Resource } from './Resource';

export declare class ModelResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  setDescription(value: string): ModelResource;

  getDescription(): string;

  setFields(value: Array<any>): ModelResource;

  getFields(): Array<any>;

  setHexColor(value: string): ModelResource;

  getHexColor(): string;

  setHooks(value: Array<any>): ModelResource;

  getHooks(): Array<any>;

  setLocales(value: Array<string>): ModelResource;

  getLocales(): Array<string>;

  setPolicies(value: Array<any>): ModelResource;

  getPolicies(): Array<any>;

  setTitle(value: string): ModelResource;

  getTitle(): string;

  setTitleField(value: string): ModelResource;

  getTitleField(): string;

  getCreated(): Date;

  getModelID(): string;

  getModified(): Date;

  hasEntries(): boolean;
}
