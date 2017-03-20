import { Resource } from './Resource';
import { filterOptions } from '../interfaces';
import { ModelList } from './ModelList';
import { ModelResource } from './ModelResource';
import { DMClientList } from './DMClientList';
import { DMClientResource } from './DMClientResource';
import { DMAccountList } from './DMAccountList';
import { DMAccountResource } from './DMAccountResource';

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

  accountList(options?: filterOptions): DMAccountList;

  account(accountID: string): DMAccountResource;
}
