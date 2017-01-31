export const stores: Map<string, TokenStore>;

class TokenStore {
  constructor(environment: string);

  set(token: string): void;

  get(): string;

  has(): boolean;

  del(): void
}

export default function TokenStoreFactory(environment: string): TokenStore;
