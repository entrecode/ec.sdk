'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const Core = require('../lib/Core');
const traverson = require('traverson');
const traversonHal = require('traverson-hal');
const Problem = require('../lib/Problem').default;
const events = require('../lib/EventEmitter').default;

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
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
    const throws = () => new Core.default();
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
  it('should have event emitter', () => {
    core.should.have.property('events', events);
    core.events.should.have.property('on');
  });
});

describe('Traverson Helper', () => {
  let dmList;
  let mock;
  let traversal;
  before((done) => {
    fs.readFile(`${__dirname}/mocks/dm-list.json`, 'utf8', (err, res) => {
      if (err) {
        return done(err);
      }
      dmList = JSON.parse(res);
      return done();
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
    it('should fire error event', () => {
      mock.get('/').replyWithError('mocked error');
      const spy = sinon.spy();
      events.on('error', spy);

      return Core.get(traversal).catch((err) => {
        err.should.be.defined;
        spy.should.be.called.once;
      });
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
    it('should fire error event', () => {
      mock.get('/').replyWithError('mocked error');
      const spy = sinon.spy();
      events.on('error', spy);

      return Core.getUrl(traversal.follow('ec:dm-stats')).catch((err) => {
        err.should.be.defined;
        spy.should.be.called.once;
      });
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
    it('should fire error event', () => {
      mock.post('/').replyWithError('mocked error');
      const spy = sinon.spy();
      events.on('error', spy);

      return Core.post(traversal).catch((err) => {
        err.should.be.defined;
        spy.should.be.called.once;
      });
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
    it('should fire error event', () => {
      mock.put('/').replyWithError('mocked error');
      const spy = sinon.spy();
      events.on('error', spy);

      return Core.put(traversal).catch((err) => {
        err.should.be.defined;
        spy.should.be.called.once;
      });
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
    it('should fire error event', () => {
      mock.delete('/').replyWithError('mocked error');
      const spy = sinon.spy();
      events.on('error', spy);

      return Core.del(traversal).catch((err) => {
        err.should.be.defined;
        spy.should.be.called.once;
      });
    });
  });
});

describe('optionsToQuery', () => {
  it('should have size', () => {
    const obj = {
      size: 1,
    };
    Core.optionsToQuery(obj).should.have.property('size', 1);
  });
  it('should have page', () => {
    const obj = {
      page: 1,
    };
    Core.optionsToQuery(obj).should.have.property('page', 1);
  });
  it('should sort one item', () => {
    const obj = {
      sort: 'name',
    };
    Core.optionsToQuery(obj).should.have.property('sort', 'name');
  });
  it('should sort multiple items', () => {
    const obj = {
      sort: ['name', '-date'],
    };
    Core.optionsToQuery(obj).should.have.property('sort', 'name,-date');
  });
  it('should throw on invalid sort', () => {
    const throws = () => {
      Core.optionsToQuery({ sort: 1 });
    };
    throws.should.throw(Error);
  });
  it('should have exact filter on string property', () => {
    const obj = {
      filter: {
        property: 'exact',
      },
    };
    Core.optionsToQuery(obj).should.have.property('property', 'exact');
  });
  it('should have exact filter', () => {
    const obj = {
      filter: {
        property: {
          exact: 'value',
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('property', 'value');
  });
  it('should have search filter', () => {
    const obj = {
      filter: {
        property: {
          search: 'value',
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('property~', 'value');
  });
  it('should have from filter', () => {
    const obj = {
      filter: {
        property: {
          from: 'value',
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('propertyFrom', 'value');
  });
  it('should have to filter', () => {
    const obj = {
      filter: {
        property: {
          to: 'value',
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('propertyTo', 'value');
  });
  it('should have any filter', () => {
    const obj = {
      filter: {
        property: {
          any: ['value1', 'value2'],
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('property', 'value1,value2');
  });
  it('should throw on any filter not an array', () => {
    const throws = () => {
      Core.optionsToQuery({ filter: { property: { any: 'string' } } });
    };
    throws.should.throw(Error);
  });
  it('should have all filter', () => {
    const obj = {
      filter: {
        property: {
          all: ['value1', 'value2'],
        },
      },
    };
    Core.optionsToQuery(obj).should.have.property('property', 'value1+value2');
  });
  it('should throw on all filter not an array', () => {
    const throws = () => {
      Core.optionsToQuery({ filter: { property: { all: 'string' } } });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid filter object', () => {
    const throws = () => {
      Core.optionsToQuery({ filter: 1 });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid filter property value', () => {
    const throws = () => {
      Core.optionsToQuery({ filter: { property: 1 } });
    };
    throws.should.throw(Error);
  });
});
