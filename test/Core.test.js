'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const should = chai.should();

const Core = require('../lib/Core');
const traverson = require('traverson');
const traversonHal = require('traverson-hal');
const Problem = require('../lib/Problem').default;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
traverson.registerMediaType(traversonHal.mediaType, traversonHal);

describe('Core', () => {
  let core;
  beforeEach(() => {
    core = new Core.default('https://datamanager.entrecode.de');
  });
  afterEach(() => {
    core = null;
  });
  it('should be instance of Core', () => {
    core.should.be.instanceOf(Core.default);
  });
  it('should throw on missing url', () => {
    const throws = () => new Core();
    throws.should.throw(Error);
  });
  it('should return traverson Builder', () => {
    core.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should return traverson Builder with continue', () => {
    core.traversal.continue = () => core.traversal; // simulate traversal with continue
    core.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should throw on undefined traversal', () => {
    const throws = () => {
      core.traversal = null;
      core.newRequest();
    };
    throws.should.throw(Error);
  });
});

describe('Traverson Helper', () => {
  let dmList;
  let dmSingle;
  let mock;
  let traversal;
  before((done) => {
    fs.readFile(`${__dirname}/mocks/dm-list.json`, 'utf8', (err, res) => {
      if (err) {
        return done(err);
      }
      dmList = JSON.parse(res);

      return fs.readFile(`${__dirname}/mocks/dm-single.json`, 'utf8', (e, r) => {
        if (e) {
          return done(e);
        }
        dmSingle = JSON.parse(r);

        return done();
      });
    });
  });
  beforeEach(() => {
    nock.disableNetConnect();
    mock = nock('https://datamanager.entrecode.de');
    traversal = traverson.from('https://datamanager.entrecode.de').jsonHal();
  });
  afterEach(() => {
    mock = null;
  });
  describe('get', () => {
    it('should be resolved', () => {
      mock.get('/').reply(200, dmList);
      Core.get(traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      mock.get('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return Core.get(traversal).should.be.rejectedWith(Problem);
    });
    it('should be rejected network error', () => {
      mock.get('/').replyWithError('mocked error');
      return Core.get(traversal).should.be.rejectedWith(Error);
    });
  });
  describe('getUrl', () => {
    it('should be resolved', () => {
      mock.get('/').reply(200, 'https://datamanager.entrecode.de/');
      return Core.getUrl(traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      mock.get('/').reply(200, dmList)
      .get('/stats').replyWithError('mocked error');
      return Core.getUrl(traversal.follow('ec:dm-stats')).should.be.eventually.rejectedWith(Error);
    });
  });
  describe('post', () => {
    it('should be resolved', () => {
      mock.post('/').reply(200, dmList);
      return Core.post(traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      mock.post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return Core.post(traversal).should.be.rejectedWith(Problem);
    });
  });
  describe('put', () => {
    it('should be resolved', () => {
      mock.put('/').reply(200, dmList);
      return Core.put(traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      mock.put('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return Core.put(traversal).should.be.rejectedWith(Problem);
    });
  });
  describe('delete', () => {
    it('should be resolved', () => {
      mock.delete('/').reply(204);
      return Core.del(traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      mock.delete('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return Core.del(traversal).should.be.rejectedWith(Problem);
    });
  });
});
