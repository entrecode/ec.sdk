import { Resource } from '../Resource';

export declare class EntryResource extends Resource {
  constructor(resource: any, environment: environment, schema: any, traversal: any);

  getFieldType(property: string): string;

  getTitle(property: string): Array<string> | string;

  getModelTitle(): string;

  getModelTitleField(): string;

  getFileUrl(field: string, locale: string): string;

  getImageUrl(field: string, size: number, locale: string): string;

  getImageThumbUrl(field: string, size: number, locale: string): string;
}

export declare function createEntry(resource: any, environment: environment, traversal: any): Promise<EntryResource>;

type environment = 'live' | 'stage' | 'nightly' | 'develop';
