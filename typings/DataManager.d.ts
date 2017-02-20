import { Core } from './Core';
import { DataManagerResource } from './resources/DataManagerResource';
import { DataManagerList } from './resources/DataManagerList';
import { filterOptions } from './interfaces';

export declare class DataManager extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<DataManagerResource>;

  dataManagerList(options?: filterOptions): Promise<DataManagerList>;

  dataManager(dataManagerID: string): Promise<DataManagerResource>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
