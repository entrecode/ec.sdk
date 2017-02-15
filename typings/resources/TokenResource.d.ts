import { Resource } from './Resource';

export declare class TokenResource extends Resource {
  constructor(resource: any, environment: string, traversal?: any);

  accessTokenID: string;

  device: any;
  ipAddress: string;
  ipAddressLocation: string;
  isCurrent: boolean;
  issued: Date;
  validUntil: Date;
}
