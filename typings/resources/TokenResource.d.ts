import { Resource } from './Resource';

export declare class TokenResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  isCurrent(): boolean;

  issued(): Date;

  validUntil(): Date;

  getIpAddress(): string;

  getIpAddressLocation(): string;

  getAccessTokenID(): string;

  getDevce(): any;
}
