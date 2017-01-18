'use strict';

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(label, callback) {
    if (!this.listeners.has(label)) {
      this.listeners.set(label, []);
    }
    this.listeners.get(label).push(callback);
  }

  on(label, callback) {
    this.addListener(label, callback);
  }

  removeListener(label, callback) {
    const listeners = this.listeners.get(label);
    const index = listeners.indexOf(callback);
    let ret;
    if (index > -1) {
      listeners.splice(index, 1);
      ret = true;
    } else {
      ret = false;
    }
    this.listeners.set(label, listeners);
    return ret;
  }

  removeAllListeners(label) {
    return this.listeners.delete(label);
  }

  emit(label, ...args) {
    const listeners = this.listeners.get(label);

    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }
}

export default new EventEmitter();
