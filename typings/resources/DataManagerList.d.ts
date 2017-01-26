import { DataManagerResource } from './DataManagerResource';
import { ListResource } from './ListResource';

export declare class DataManagerList extends ListResource {
  constructor(resource: any, name?: string, traversal?: any);

  create(dataManager: any): Promise<DataManagerResource>;
}
