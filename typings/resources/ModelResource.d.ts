import { Resource } from './Resource';

export declare class AccountResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  setDescription(value: string): AccountResource;

  getDescription(): string;

  setFields(value: Array<any>): AccountResource;

  getFields(): Array<any>;

  setHexColor(value: string): AccountResource;

  getHexColor(): string;

  setHooks(value: Array<any>): AccountResource;

  getHooks(): Array<any>;

  setLocales(value: Array<string>): AccountResource;

  getLocales(): Array<string>;

  setPolicies(value: Array<any>): AccountResource;

  getPolicies(): Array<any>;

  setTitle(value: string): AccountResource;

  getTitle(): string;

  setTitleField(value: string): AccountResource;

  getTitleField(): string;

  getCreated(): Date;

  getModelID(): string;

  getModified(): Date;

  hasEntries(): boolean;
}
