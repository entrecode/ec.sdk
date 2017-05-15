import { Resource } from '../Resource';

export declare class EntryResource extends Resource {
  constructor(resource: any, environment: environment, schema: any, traversal: any);

  getFieldType(property: string): string;

  getTitle(property: string): Array<string> | string;

  getModelTitle(): string;

  getModelTitleField(): string;
}

export declare function create(resource: any, environment: environment, traversal: any): Promise<EntryResource>;

type environment = 'live' | 'stage' | 'nightly' | 'develop';
