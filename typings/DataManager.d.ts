import { Core } from './Core';
import { DataManagerResource } from './resources/DataManagerResource';
import { DataManagerList } from './resources/DataManagerList';
import { filterOptions } from './interfaces';
import { TemplateList } from './resources/TemplateList';
import { TemplateResource } from './resources/TemplateResource';

export declare class DataManager extends Core {
  constructor(environment?: environment);

  create(dataManager: any): Promise<DataManagerResource>;

  dataManagerList(options?: filterOptions): Promise<DataManagerList>;

  dataManager(dataManagerID: string): Promise<DataManagerResource>;

  templateList(options?: filterOptions): TemplateList;

  template(templateID: string): TemplateResource;

  createTemplate(template: { name: string, collection: any, dataSchema: any, version: string }): TemplateResource;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
