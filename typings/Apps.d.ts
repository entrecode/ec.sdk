import { Core } from './Core';
import { AppResource } from './resources/apps/AppResource';
import { environment, filterOptions } from './interfaces';
import { AppList } from './resources/apps/AppList';
import { AppStatsList } from './resources/apps/AppStatsList';
import { AppStatsResource } from './resources/apps/AppStatsResource';

export declare class Apps extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<AppResource>;

  appList(options?: filterOptions): Promise<AppList>;

  app(appID: string): Promise<AppResource>;

  statsList(): Promise<AppStatsList>;

  stats(dataManagerID: string): Promise<AppStatsResource>;

}
