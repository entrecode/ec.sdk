import { Core } from './Core';
import { assetInput, assetOptions, environment, filterOptions } from './interfaces';
import { EntryList } from './resources/publicAPI/EntryList';
import { EntryResource } from './resources/publicAPI/EntryResource';
import { PublicAssetList } from './resources/publicAPI/PublicAssetList';
import { PublicAssetResource } from './resources/publicAPI/PublicAssetResource';

export declare class PublicAPI extends Core {
  constructor(id: string, environment?: environment, ecUser?: boolean);

  shortID: string;
  dataManagerID: string;
  title: string;
  description: string;
  locales: Array<string>;
  defaultLocale: string;
  models: Array<any>;
  account: any;
  config: any;

  resolve(reload: boolean): PublicAPI;

  modelList(): any;

  setClientID(clientID: string): PublicAPI;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite?: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  createAnonymous(validUntil: Date): Promise<any>;

  me(): Promise<any>;

  getSchema(model: string, method?: string): Promise<any>;

  getAuthLink(name: string, templateParameter?: any): Promise<string>;

  entryList(model: string, options?: filterOptions): Promise<EntryList>;

  entry(model: string, id: string, options: number | { _levels?: number, _fields?: number }): Promise<EntryResource>;

  createEntry(model: string, entry: any, levels?: number): Promise<EntryResource>;

  checkPermission(permission: string, refresh?: boolean): Promise<boolean>;

  assetList(options?: filterOptions): Promise<PublicAssetList>;

  asset(assetID: string): Promise<PublicAssetResource>;

  createAsset(input: assetInput, options?: assetOptions): Promise<() => Promise<PublicAssetResource>>;

  createAssets(input: any | Array<assetInput>, options?: assetOptions): Promise<() => Promise<PublicAssetList>>;

  getFileUrl(assetID: string, locale?: string): Promise<string>;

  getImageUrl(assetID: string, size?: number, locale?: string): Promise<string>;

  getImageThumbUrl(assetID: string, size?: number, locale?: string): Promise<string>;
}
