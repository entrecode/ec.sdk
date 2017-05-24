import { Resource } from './Resource';

export declare class ListResource extends Resource {
  constructor(resource: any, environment: string, name?: string, traversal?: any);

  getAllItems(): Array<any>

  getItem(n: number): any;

  getFirstItem(): any;

  hasFirstLink(): boolean;

  followFirstLink(): Promise<any>;

  hasNextLink(): boolean;

  followNextLink(): Promise<any>;

  hasPrevLink(): boolean;

  followPrevLink(): Promise<any>;

  map(iterator: (item: Resource) => any | Promise<any>): Array<any>;
}
