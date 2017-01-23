import { Resource } from './Resource';

export declare class ListResource extends Resource {
  constructor(resource: any, name?: string, traversal?: any);

  getAllItems(): Array<Resource>

  getItem(n: number): Resource;

  getFirstItem(): Resource;

  hasFirstLink(): boolean;

  followFirstLink(): Promise<ListResource>;

  hasNextLink(): boolean;

  followNextLink(): Promise<ListResource>;

  hasPrevLink(): boolean;

  followPrevLink(): Promise<ListResource>;
}
