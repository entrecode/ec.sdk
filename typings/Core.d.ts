export declare class Core {
  constructor(url: string);

  newRequest(): any;

  follow(link: string): any;

  setToken(token: string): Core;

  setUserAgent(agent: string): Core;

  on(label: string, callback: (param: Error | string) => void): void;

  removeListener(label: string, callback: () => void): boolean;
}
