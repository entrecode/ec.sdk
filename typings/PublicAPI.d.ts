import { Core } from './Core';
import { assetInput, assetOptions, filterOptions } from './interfaces';
import { EntryList } from './resources/publicAPI/EntryList';
import { EntryResource } from './resources/publicAPI/EntryResource';
import { PublicAssetList } from './resources/publicAPI/PublicAssetList';
import { PublicAssetResource } from './resources/publicAPI/PublicAssetResource';

export declare class PublicAPI extends Core {
  constructor(id: string, environment?: environment);

  resolve(reload: boolean): PublicAPI;

  modelList(): any;

  setClientID(clientID: string): PublicAPI;

  login(email: string, password: string): Promise<string>;

  logout(): Promise<void>;

  emailAvailable(email: string): Promise<boolean>;

  signup(email: string, password: string, invite: string): Promise<string>;

  resetPassword(email: string): Promise<undefined>;

  createAnonymous(validUntil: Date): Promise<any>;

  me(): Promise<any>;

  getSchema(model: string, method?: string): Promise<any>;

  entryList(model: string, options?: filterOptions): Promise<EntryList>;

  entry(model: string, id: string, levels: number): Promise<EntryResource>;

  createEntry(model:string, entry: any): Promise<EntryResource>;

  checkPermission(permission): Promise<boolean>;

  assetList(options?: filterOptions): PublicAssetList;

  asset(assetID: string): PublicAssetResource;

  createAsset(input: assetInput, options: assetOptions): () => Promise<PublicAssetResource>;

  createAsset(input: Array<assetInput>, options: assetOptions): () => Promise<PublicAssetList>;

  getFileUrl(assetID: string, locale?: string): Promise<string>;

  getImageUrl(assetID: string, size?: number, locale?: string): Promise<string>;

  getImageThumbUrl(assetID: string, size?: number, locale?: string): Promise<string>;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
