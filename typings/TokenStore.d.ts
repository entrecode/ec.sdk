export const stores: Map<string, TokenStore>;

class TokenStore {
  constructor(environment: string);

  set(token: string): void;

  get(): string;

  has(): boolean;

  del(): void

  setClientID(clientID: string): void;

  getClientID(): string;

  hasClientID(): boolean;

  setUserAgent(agent: string): void;

  getUserAgent(): string;

  hasUserAgent(): boolean;
}

export default function TokenStoreFactory(environment: string): TokenStore;
