import { Resource } from '../Resource';

export declare class AppStatsResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  appID: string;
  title: string;
  totalBuilds: string;
  totalBuildSize: string;
  monthlyBuilds: any;
  totalDeployments: string;
  monthlyDeployments: any;
  usedCodeSources: Array<string>;
  usedDataSources: Array<string>;
  usedTargets: Array<string>;
  usedPlatforms: Array<string>;
}
