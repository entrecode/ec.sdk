import { Resource } from './Resource';

export declare class ListResource extends Resource {
  constructor(resource: any, name?: string, traversal?: any);

  getAllItems(): Array<any>

  getItem(n: number): any;

  getFirstItem(): any;

  hasFirstLink(): boolean;

  followFirstLink(): Promise<any>;

  hasNextLink(): boolean;

  followNextLink(): Promise<any>;

  hasPrevLink(): boolean;

  followPrevLink(): Promise<any>;
}
