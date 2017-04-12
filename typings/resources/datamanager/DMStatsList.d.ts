import { Resource } from '../Resource';
import { DMStatsResource } from './DMStatsResource';

export declare class DMStatsList extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  getAllItems(): Array<DMStatsResource>;

  getItem(n: number): DMStatsResource;

  getFirstItem(): DMStatsResource;
}
