'use strict';

export default class Problem extends Error {
  constructor(error) {
    super(error.title);

    ['title', 'code', 'status', 'type', 'detail', 'verbose', 'requestID'].forEach((property) => {
      if ({}.hasOwnProperty.call(error, property)) {
        this[property] = error[property];
      }
    });

    if ({}.hasOwnProperty.call(error, 'stack')) {
      this.remoteStack = error.stack;
    }

    if ({}.hasOwnProperty.call(error, '_embedded')) {
      let subErrors = error._embedded.error;
      if (!Array.isArray(subErrors)) {
        subErrors = [subErrors];
      }
      this.subErrors = subErrors.map(e => new Problem(e));
    }
  }

  short() {
    return `${this.title} (${this.code})`;
  }

  shortAll() {
    let out = `${this.short()}\nSubErrors:\n`;
    this.subErrors.forEach((e) => {
      out += `  ${e.short().split('\n').join('  \n')}\n`;
    });
    return out;
  }

  long() {
    return `${this.title} (${this.code})
${this.detail}${this.verbose ? ` - ${this.verbose}` : ''}${this.requestID ? ` (${this.requestID})` : ''}`;
  }

  longAll() {
    let out = `${this.long()}\nSubErrors:\n`;
    this.subErrors.forEach((e) => {
      out += `  ${e.short().split('\n').join('  \n')}\n`;
    });
    return out;
  }

  getAsArray() {
    return [this, ...this.subErrors];
  }
}
