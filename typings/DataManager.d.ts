import { Core } from './Core';
import { DataManagerResource } from './resources/datamanager/DataManagerResource';
import { DataManagerList } from './resources/datamanager/DataManagerList';
import { filterOptions } from './interfaces';
import { TemplateList } from './resources/datamanager/TemplateList';
import { TemplateResource } from './resources/datamanager/TemplateResource';
import { DMStatsList } from './resources/datamanager/DMStatsList';
import { DMStatsResource } from './resources/datamanager/DMStatsResource';

export declare class DataManager extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<DataManagerResource>;

  dataManagerList(options?: filterOptions): Promise<DataManagerList>;

  dataManager(dataManagerID: string): Promise<DataManagerResource>;

  templateList(options?: filterOptions): TemplateList;

  template(templateID: string): TemplateResource;

  createTemplate(template: { name: string, collection: any, dataSchema: any, version: string }): TemplateResource;

  statsList(): DMStatsList;

  stats(dataManagerID: string): DMStatsResource;

  getFileUrl(assetID: string, locale?: string): string;

  getImageUrl(assetID: string, size?: number, locale?: string): string;

  getImageThumbUrl(assetID: string, size?: number, locale?: string): string;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
