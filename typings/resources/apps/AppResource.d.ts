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

  platformList(options?: filterOptions): PlatformList;

  platform(platformID: string): PlatformResource;

  codeSourceList(options?: filterOptions): CodeSourceList;

  codeSource(codeSourceID: string): CodeSourceResource;

  createCodeSource(codeSource: any): CodeSourceResource;

  dataSourceList(options?: filterOptions): DataSourceList;

  dataSource(codeSourceID: string): DataSourceResource;

  createDataSource(codeSource: any): DataSourceResource;

  targetList(options?: filterOptions): TargetList;

  target(codeSourceID: string): TargetResource;

  createTarget(codeSource: any): TargetResource;
}
