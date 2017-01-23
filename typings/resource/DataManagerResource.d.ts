import { Resource } from './Resource';

export declare class DataManagerResource extends Resource {
  constructor(resource: any, traversal?: any);

  setTitle(value: string): DataManagerResource;

  getTitle(): string;

  setDescription(value: string): DataManagerResource;

  getDescription(): string;

  setConfig(value: any): DataManagerResource;

  getconfig(): any;

  setHexColor(value: string): DataManagerResource;

  getHexColor(): string;

  setLocales(value: Array<string>): DataManagerResource;

  getLocales(): Array<string>
}
