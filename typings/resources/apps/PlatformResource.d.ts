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

  createDeployment(targetIDs: targetIDsType, buildID: buildIDType): Promise<DeploymentResource>;

  deployLatestBuild(targetIDs: targetIDsType): Promise<DeploymentResource>;

  loadCodeSource(): Promise<CodeSourceResource>;

  loadDataSource(): Promise<DataSourceResource>;

  loadTargets(): Promise<TargetList>;

  getCodeSource(): string;

  setCodeSource(codeSource: string | CodeSourceResource): string | CodeSourceResource;

  getDataSource(): string;

  setDataSource(dataSource: string | DataSourceResource): string | DataSourceResource;

  getTargets(): Array<string>;

  setTargets(targets: Array<string | TargetResource>): Array<string | TargetResource>;

  addTarget(target: string | TargetResource): string | TargetResource;

  removeTarget(target: string | TargetResource): void;

  hasTarget(target: string | TargetResource): boolean;
}

type targetIDsType = string | TargetResource | Array<string> | Array<TargetResource> | TargetList;

type buildIDType = string | BuildResource;
