export declare class Core {
  constructor(url: environment);

  newRequest(): any;

  setToken(token: string): Core;
}

type environment = 'live' | 'stage' | 'nightly' | 'develop';

export function get(t: any): Promise<any>;

export function getUrl(t: any): Promise<string>;

export function post(t: any): Promise<any>;

export function put(t: any): Promise<any>;

export function del(t: any): Promise<any>;

export function optionsToQuery(t: any): any;
