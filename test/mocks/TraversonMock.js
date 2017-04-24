/**
 * Mock for Traverson. Only contains functions called by ec.sdk with no added functionality.
 */
class TraversonMock {
  continue() {
    return this;
  }

  newRequest() {
    return this;
  }

  follow() {
    return this;
  }

  withTemplateParameters() {
    return this;
  }
}

module.exports = TraversonMock;
