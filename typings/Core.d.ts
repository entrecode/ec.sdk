export declare class Core {
  constructor(url: environment);

  newRequest(): any;

  setToken(token: string): Core;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
