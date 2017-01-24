import { Core } from './Core';
import { AccountList } from './resource/AccountList';
import { AccountResource } from './resource/AccountResource';
import { filterOptions } from './interfaces';

export declare class Accounts extends Core {
  constructor(environment?: string);

  list(options?: filterOptions): Promise<AccountList>;

  get(accountID: string): Promise<AccountResource>;
}
