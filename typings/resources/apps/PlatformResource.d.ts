import { Resource } from '../Resource';
import { filterOptions } from '../../interfaces';
import { BuildResource } from './BuildResource';
import { BuildList } from './BuildList';
import { DeploymentResource } from './DeploymentResource';
import { DeploymentList } from './DeploymentList';
import { CodeSourceResource } from './CodeSourceResource';
import { DataSourceResource } from './DataSourceResource';
import { TargetList } from './TargetList';
import { TargetResource } from './TargetResource';

export declare class PlatformResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  platformID: string;
  title: string;
  config: any;
  platformType: string;

  buildList(options?: filterOptions): Promise<BuildList>;

  build(buildID: string): Promise<BuildResource>;

  createBuild(): Promise<BuildResource>;

  latestBuild(): Promise<BuildResource>;

  deploymentList(options?: filterOptions): Promise<DeploymentList>;

  deployment(deploymentID: string): Promise<DeploymentResource>;

  createDeployment(targetIDs: targetIDsType, buildID: buildIDType);

  deployLatestBuild(targetIDs: targetIDsType): Promise<DeploymentResource>;

  codeSource(): Promise<CodeSourceResource>;

  dataSource(): Promise<DataSourceResource>;

  targets(): Promise<TargetList>;
}

type targetIDsType = string | TargetResource | Array<string> | Array<TargetResource> | TargetList;

type buildIDType = string | BuildResource;
