import { Resource } from '../Resource';
import { environment } from '../../interfaces';
import { EntryResource } from './EntryResource';

export declare class LiteEntryResource extends Resource {
  constructor(liteResource: any, environment: environment);

  _id: String;
  id: string;
  _entryTitle: String;

  resolve(): Promise<EntryResource>;

  save(): Promise<EntryResource>;

  getTitle(property?: string): Array<string> | string;

  getModelTitle(): string;
}
