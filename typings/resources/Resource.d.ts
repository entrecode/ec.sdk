export declare class Resource {
  constructor(resource: any, environment: string, traversal?: any);

  newRequest(): any;

  isDirty(): boolean;

  reset(): void;

  save(): Promise<any>

  del(): Promise<void>;

  hasLink(link: string): boolean;

  getLink(link: string): any;

  get(properties: any): any;

  set(resource: any): any;

  getProperty(property: string): any;

  setProperty(property: string, value: any): any;
}
