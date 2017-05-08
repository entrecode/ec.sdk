import { Core } from './Core';

export declare class PublicAPI extends Core {
  constructor(id: string, environment?: environment);

  resolve(reload: boolean): PublicAPI;

  modelList(): any;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
