const { getLocalised } = require('ec.errors')();

interface Problem extends Error {
  status: number;
  type: string;
  message: string;
  code: number;
  detail: string;
  remoteStack: string;
  requestID: string;
  subErrors: Problem | any;
  title: string;
  verbose: string;
  method: string,
  url: string,
}

/**
 * Class representing Errors sent by all entrecode APIs. Complies to {@link
 * https://tools.ietf.org/html/draft-nottingham-http-problem-07 Problem Details for HTTP APIs}.
 * Problems also comply to {@link https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL
 * resources} but this class won't include any special hal implementation (like getEmbedded or
 * getLinks).
 */
class Problem extends Error {
  /**
   * Creates a new {@link Problem} with the given error object. May contain embedded {@link
   * Problem}s.
   *
   * @param {object} error the error received from any entrecode API.
   */
  public constructor(error: Problem | any, locale: string = 'en') {
    super(error.title || error.message);

    Object.assign(this, error);
    if (!('title' in error)) {
      Object.assign(this, {
        title: this.message,
      });
    }

    if (locale !== 'en') {
      const localised = getLocalised(Object.assign({}, this), locale);
      this.message = localised.message;
      this.title = localised.message;
    }

    if ('stack' in error) {
      this.stack = error.stack;
    }

    if ('_embedded' in error && 'error' in error._embedded) {
      let subErrors = error._embedded.error;
      if (!Array.isArray(subErrors)) {
        subErrors = [subErrors];
      }
      this.subErrors = subErrors.map((e) => new Problem(e, locale));
    } else if ('subErrors' in error) {
      this.subErrors = error.subErrors.map((e) => new Problem(e, locale));
    } else {
      this.subErrors = [];
    }
  }

  /**
   * Get all {@link Problem}s as an array.
   *
   * @returns {array<Problem>} array of all problems.
   */
  public getAsArray(): Array<Problem> {
    return [this, ...this.subErrors].filter((x) => !!x);
  }

  /**
   * More detailed string representation for this error. Will contain newlines.
   *
   * @returns {string} detailed string representation.
   */
  public long(): string {
    return `${this.title} (${this.code})
${this.detail}${this.verbose ? ` - ${this.verbose}` : ''}${this.requestID ? ` (${this.requestID})` : ''}`;
  }

  /**
   * More detailed string representation for this and short strin representation for all sub
   * errors. Will contain newlines.
   *
   * @returns {string} detailed string representation.
   */
  public longAll(): string {
    return `${this.long()}${this.sub()}`;
  }

  /**
   * Get short string representation of this error.
   *
   * @returns {string} short string representation.
   */
  public short(): string {
    return `${this.title} (${this.code})`;
  }

  /**
   * Get short string representation for this and all sub errors. Will contain newlines for each
   * sub error.
   *
   * @returns {string} short string representation
   */
  public shortAll(): string {
    return `${this.short()}${this.sub()}`;
  }

  /**
   * Creates short string representation of all sub errors.
   *
   * @access private
   *
   * @returns {string} short representation of all sub errors.
   */
  private sub(): string {
    let out = '\nSubErrors:\n';
    this.subErrors.forEach((e) => {
      out += `  ${e
        .short()
        .split('\n')
        .join('  \n')}\n`;
    });
    return out;
  }
}

export default Problem;
