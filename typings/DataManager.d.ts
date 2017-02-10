import { Core } from './Core';
import { DataManagerResource } from './resources/DataManagerResource';
import { DataManagerList } from './resources/DataManagerList';
import { filterOptions } from './interfaces';

export declare class DataManager extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<DataManagerResource>;

  list(options?: filterOptions): Promise<DataManagerList>;

  get(dataManagerID: string): Promise<DataManagerResource>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
