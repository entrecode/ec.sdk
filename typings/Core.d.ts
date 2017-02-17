export declare class Core {
  constructor(url: string);

  newRequest(): any;

  setToken(token: string): Core;

  on(label: string, callback: () => void): void;

  removeListener(label: string, callback: () => void): boolean;
}
