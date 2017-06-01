import { Resource } from '../Resource';

export declare class TypesResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  platformTypes: Array<any>;
  codeSourceTypes: Array<any>;
  dataSourceTypes: Array<any>;
  targetTypes: Array<any>;

  getPlugin(pluginName: string, type: string): any;

  getPlatform(type: string): any;

  getCodeSource(type: string): any;

  getDataSource(type: string): any;

  getTarget(type: string): any;

  getPluginSchema(pluginName: string, type: string): any;

  getPlatformSchema(type: string): any;

  getCodeSourceSchema(type: string): any;

  getDataSourceSchema(type: string): any;

  getTargetSchema(type: string): any;

  getAvailableTypes(pluginName: string): Array<string>;

  getAvailablePlatforms(): Array<string>;

  getAvailableCodeSources(): Array<string>;

  getAvailableDataSources(): Array<string>;

  getAvailableTargets(): Array<string>;
}
