export declare class EventEmitter {
  constructor();

  addListener(label: string, callback: () => void): void;

  on(label: string, callback: () => void): void;

  removeListener(label: string, callback: () => void): boolean;

  removeAllListeners(label: string): boolean;

  private emit(label: string, ...args: Array<any>): boolean;
}

export const emitter: EventEmitter;
