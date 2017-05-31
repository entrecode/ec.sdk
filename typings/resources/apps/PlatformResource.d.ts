import { Resource } from '../Resource';
import { filterOptions } from '../../interfaces';
import { BuildResource } from './BuildResource';
import { BuildList } from './BuildList';

export declare class PlatformResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  platformID: string;
  title: string;
  config: any;
  platformType: string;

  buildList(options?: filterOptions): BuildList;

  build(buildID: string): BuildResource;

  latestBuild(): BuildResource;

  createBuild(): BuildResource;
}
