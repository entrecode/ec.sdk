'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const should = chai.should();

const Problem = require('../lib/Problem').default;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Problem', () => {
  let error;
  beforeEach(() => {
    error = new Problem({
      title: 'title',
      code: 1100,
      status: 400,
      type: 'https://doc.entrecode.de/#error-100',
      detail: 'detail',
      verbose: 'verbose',
      requestID: 'id',
      stack: 'Error: title\n    at newError (/path/file.js:7:7)',
      _embedded: {
        error: [
          {
            status: 400,
            code: 1100,
            title: 'embedded1',
            type: 'https://doc.entrecode.de/#error-100',
          },
          {
            status: 400,
            code: 1100,
            title: 'embedded1',
            type: 'https://doc.entrecode.de/#error-100',
          },
        ],
      },
    });
  });
  afterEach(() => {
    error = null;
  });
  it('should be instance of Error', () => {
    error.should.be.instanceOf(Error);
  });
  it('should be instance of Problem', () => {
    error.should.be.instanceOf(Problem);
  });
  it('should have title', () => {
    error.should.have.property('title', 'title');
  });
  it('should have message equal title', () => {
    error.should.have.property('message', error.title);
  });
  it('should have code', () => {
    error.should.have.property('code', 1100);
  });
  it('should have status', () => {
    error.should.have.property('status', 400);
  });
  it('should have type', () => {
    error.should.have.property('type', 'https://doc.entrecode.de/#error-100');
  });
  it('should have detail', () => {
    error.should.have.property('detail', 'detail');
  });
  it('should have verbose', () => {
    error.should.have.property('verbose', 'verbose');
  });
  it('should have remote stack', () => {
    error.should.have.property('remoteStack', 'Error: title\n    at newError (/path/file.js:7:7)');
  });
  it('should have short pretty string representation', () => {
    error.short().should.be
    .equal('title (1100)');
  });
  it('should have long pretty string representation', () => {
    error.long().should.be
    .equal('title (1100)\ndetail - verbose (id)');
  });
  it('should have long string without verbose and requestID', () => {
    error = new Problem({
      title: 'title',
      code: 1100,
      status: 400,
      type: 'https://doc.entrecode.de/#error-100',
      detail: 'detail',
    });
    error.long().should.be
    .equal('title (1100)\ndetail');
  });
  it('should have sub errors', () => {
    error.subErrors.should.be.instanceOf(Array);
    error.subErrors.forEach((e) => {
      e.should.be.instanceOf(Problem);
    });
  });
  it('should get all errors', () => {
    error.getAsArray().should.be.instanceOf(Array);
    error.getAsArray().length.should.be.equal(3);
    error.getAsArray().forEach((e) => {
      e.should.be.instanceOf(Problem);
    });
  });
  it('should get all errors with single sub error', () => {
    error = new Problem({
      title: 'title',
      code: 1100,
      status: 400,
      type: 'https://doc.entrecode.de/#error-100',
      _embedded: {
        error: {
          status: 400,
          code: 1100,
          title: 'embedded1',
          type: 'https://doc.entrecode.de/#error-100',
        },
      },
    });
    error.getAsArray().should.be.instanceOf(Array);
    error.getAsArray().length.should.be.equal(2);
    error.getAsArray().forEach((e) => {
      e.should.be.instanceOf(Problem);
    });
  });
  it('should have short pretty string for all errors', () => {
    error.shortAll().should.be
    .equal('title (1100)\nSubErrors:\n  embedded1 (1100)\n  embedded1 (1100)\n');
  });
  it('should have long pretty string for all errors', () => {
    error.longAll().should.be
    .equal('title (1100)\ndetail - verbose (id)\nSubErrors:\n  embedded1 (1100)\n  embedded1 (1100)\n');
  });
});
