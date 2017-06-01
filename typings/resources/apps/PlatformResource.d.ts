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

  buildList(options?: filterOptions): Promise<BuildList>;

  build(buildID: string): Promise<BuildResource>;


  latestBuild(): Promise<BuildResource>;

  deploymentList(options?: filterOptions): Promise<DeploymentList>;

  deployment(deploymentID: string): Promise<DeploymentResource>;

}
