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
}

export default function TokenStoreFactory(environment: string): TokenStore;
