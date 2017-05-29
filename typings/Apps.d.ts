import { Core } from './Core';
import { AppResource } from './resources/apps/AppResource';
import { filterOptions } from './interfaces';
import { AppList } from './resources/apps/AppList';

export declare class Apps extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<AppResource>;

  appList(options?: filterOptions): Promise<AppList>;

  app(appID: string): Promise<AppResource>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
