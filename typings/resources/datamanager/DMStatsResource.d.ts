import { Resource } from '../Resource';

export declare class DMStatsResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  dataManagerID: string;

  title: string;
  config: any;
  templateID: string;
  templateName: string;
  templateVersion: string;
  modelCount: number;
  entryCount: number;
  assetCount: number;
  fileCount: number;
  fileSize: number;
  numberAccounts: number;
  numberRequests: number;
  numberHookRequests: number;

  monthlyRequests: Array<any>;
  monthlyHooks: Array<any>;
}
