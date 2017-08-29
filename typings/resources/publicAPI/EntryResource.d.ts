import { environment } from '../../interfaces';
import { LiteEntryResource } from './LiteEntryResource';

export declare class EntryResource extends LiteEntryResource {
  constructor(resource: any, environment: environment, schema: any, traversal: any);

  [key: string]: any;
  _entryTitle: String;

  getFieldType(property: string): string;

  getModelTitleField(): string;

  getLevelCount(): number;

  getFileUrl(field: string, locale: string): string;

  getImageUrl(field: string, size: number, locale: string): string;

  getImageThumbUrl(field: string, size: number, locale: string): string;
}

export declare function createEntry(resource: any, environment: environment, traversal: any): Promise<EntryResource>;
