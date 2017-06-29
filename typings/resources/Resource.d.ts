export declare class Resource {
  constructor(resource: any, environment: string, traversal?: any);

  isDirty: boolean;

  newRequest(): any;

  resolve(): any;

  reset(): void;

  save(): Promise<any>

  del(): Promise<void>;

  hasLink(link: string): boolean;

  getLink(link: string): any;

  getLinks(link: string): Array<any>;

  allLinks(): { [key: string]: Array<any> }

  get(properties: any): any;

  set(resource: any): any;

  getProperty(property: string): any;

  setProperty(property: string, value: any): any;
}
