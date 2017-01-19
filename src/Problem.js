'use strict';

/**
 * Class representing Errors sent by all entrecode APIs. Complies to {@link
  * https://tools.ietf.org/html/draft-nottingham-http-problem-07 | Problem Details for HTTP APIs}.
 * Problems also comply to {@link https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL
  * resources} but this class won't include any special hal implementation (like getEmbedded or
 * getLinks).
 */
export default class Problem extends Error {
  /**
   * Creates a new {@link Problem} with the given error object. May contain embedded {@link
    * Problem}s.
   *
   * @param {object} error the error received from any entrecode API.
   */
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

    if ({}.hasOwnProperty.call(error, '_embedded') && {}.hasOwnProperty.call(error._embedded, 'error')) {
      let subErrors = error._embedded.error;
      if (!Array.isArray(subErrors)) {
        subErrors = [subErrors];
      }
      this.subErrors = subErrors.map(e => new Problem(e));
    }
  }

  /**
   * Get short string representation of this error.
   *
   * @returns {string} short string representation.
   */
  short() {
    return `${this.title} (${this.code})`;
  }

  /**
   * Get short string representation for this and all sub errors. Will contain newlines for each
   * sub error.
   *
   * @returns {string} short string representation
   */
  shortAll() {
    let out = `${this.short()}\nSubErrors:\n`;
    this.subErrors.forEach((e) => {
      out += `  ${e.short().split('\n').join('  \n')}\n`;
    });
    return out;
  }

  /**
   * More detailed string representation for this error. Will contain newlines.
   *
   * @returns {string} detailed string representation.
   */
  long() {
    return `${this.title} (${this.code})
${this.detail}${this.verbose ? ` - ${this.verbose}` : ''}${this.requestID ? ` (${this.requestID})` : ''}`;
  }

  /**
   * More detailed string representation for this and short strin representation for all sub
   * errors. Will contain newlines.
   *
   * @returns {string} detailed string representation.
   */
  longAll() {
    let out = `${this.long()}\nSubErrors:\n`;
    this.subErrors.forEach((e) => {
      out += `  ${e.short().split('\n').join('  \n')}\n`;
    });
    return out;
  }

  /**
   * Get all {@link Problem}s as an array.
   *
   * @returns {array<Problem>} array of all problems.
   */
  getAsArray() {
    return [this, ...this.subErrors];
  }
}
