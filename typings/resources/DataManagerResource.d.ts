import { Resource } from './Resource';
import { filterOptions } from '../interfaces';
import { ModelList } from './ModelList';
import { ModelResource } from './ModelResource';
import { DMClientList } from './DMClientList';
import { DMClientResource } from './DMClientResource';
import { DMAccountList } from './DMAccountList';
import { DMAccountResource } from './DMAccountResource';
import { RoleList } from './RoleList';
import { RoleResource } from './RoleResource';
import { DMStatsResource } from './DMStatsResource';
import { AssetList } from './AssetList';
import { AssetResource } from './AssetResource';

export declare class DataManagerResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  dataManagerID: string;

  config: any;
  description: string;
  hexColor: string;
  locales: Array<string>;
  title: string;

  modelList(options?: filterOptions): ModelList

  model(modelID: string): ModelResource;

  clientList(options?: filterOptions): DMClientList;

  client(clientID: string): DMClientResource;

  createClient(client: { callbackURL: string, tokenMethod: Array<string>, disableStrategies: Array<string>, hexColor: string }): DMClientResource;

  accountList(options?: filterOptions): DMAccountList;

  account(accountID: string): DMAccountResource;

  roleList(options?: filterOptions): RoleList;

  role(roleID: string): RoleResource;

  createRole(role: { name: string, label: string, addUnregistered: boolean, addRegistered: boolean, accounts: Array<string> }): RoleResource;

  stats(): DMStatsResource;

  assetList(options?: filterOptions): AssetList;

  asset(assetID: string): AssetResource;
}
