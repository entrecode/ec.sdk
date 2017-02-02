type environment = 'live' | 'stage' | 'nightly' | 'develop';

export function get(environment: environment, t: any): Promise<any>;

export function getUrl(environment: environment, t: any): Promise<string>;

export function post(environment: environment, t: any): Promise<any>;

export function put(environment: environment, t: any): Promise<any>;

export function del(environment: environment, t: any): Promise<any>;

export function superagentFormPost(url: string, form: any): Promise<string>

export function optionsToQuery(t: any): any;
