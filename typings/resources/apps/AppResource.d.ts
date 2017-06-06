import { Resource } from '../Resource';
import { filterOptions } from '../../interfaces';
import { PlatformList } from './PlatformList';
import { PlatformResource } from './PlatformResource';
import { CodeSourceList } from './CodeSourceList';
import { CodeSourceResource } from './CodeSourceResource';
import { DataSourceResource } from './DataSourceResource';
import { DataSourceList } from './DataSourceList';
import { TargetResource } from './TargetResource';
import { TargetList } from './TargetList';

export declare class AppResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  appID: string;
  shortID: string;
  title: string;
  hexColor: string;
  created: Date;

  platformList(options?: filterOptions): Promise<PlatformList>;

  platform(platformID: string): Promise<PlatformResource>;

  createPlatform(platform: any): Promise<PlatformResource>;

  codeSourceList(options?: filterOptions): Promise<CodeSourceList>;

  codeSource(codeSourceID: string): Promise<CodeSourceResource>;

  createCodeSource(codeSource: any): Promise<CodeSourceResource>;

  dataSourceList(options?: filterOptions): Promise<DataSourceList>;

  dataSource(codeSourceID: string): Promise<DataSourceResource>;

  createDataSource(codeSource: any): Promise<DataSourceResource>;

  targetList(options?: filterOptions): Promise<TargetList>;

  target(codeSourceID: string): Promise<TargetResource>;

  createTarget(codeSource: any): Promise<TargetResource>;
}
