export declare class Core {
  constructor(url: environment);

  newRequest(): any;

  setToken(token: string): Core;
  
  on(label: string, callback: () => void): void;

  removeListener(label: string, callback: () => void): boolean;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';
