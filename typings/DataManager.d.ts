import { Core } from './Core';
import { DataManagerResource } from './resource/DataManagerResource';
import { DataManagerList } from './resource/DataManagerList';
import { filterOptions } from './interfaces';

export declare class DataManager extends Core {
  constructor(environment: string, token?: string);

  list(options?: filterOptions): Promise<DataManagerList>;

  get(dataManagerID: string): Promise<DataManagerResource>;
}
