export declare class Core {
  constructor(urls: any, environment: string, cookieModifier?: string);

  newRequest(): any;

  follow(link: string): any;

  setToken(token: string): Core;

  setUserAgent(agent: string): Core;

  on(label: string, callback: (param: Error | string) => void): void;

  removeListener(label: string, callback: () => void): boolean;

  preloadSchemas(schemas: string | Array<string>): Promise<undefined>;
}
