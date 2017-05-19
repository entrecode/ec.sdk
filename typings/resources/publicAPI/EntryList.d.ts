import { ListResource } from '../ListResource';

export declare class EntryList extends ListResource {
  constructor(resource: any, environment: environment, name: string, schema: any, traversal?: any);
}

export declare function createList(resource: any, environment: environment, name: string, traversal: any): Promise<EntryList>;

type environment = 'live' | 'stage' | 'nightly' | 'develop';
