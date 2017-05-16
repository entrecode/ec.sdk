import { ListResource } from '../ListResource';
import { filterOptions } from '../../interfaces';
import { PublicTagList } from './PublicTagList';
import { PublicTagResource } from './PublicTagResource';

export declare class PublicAssetList extends ListResource {
  constructor(resource: any, environment: string, traversal?: any);

  tagList(options?: filterOptions): PublicTagList;

  tag(tag: string): PublicTagResource;
}
