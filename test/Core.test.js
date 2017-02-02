/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const Core = require('../lib/Core');
const helper = require('../lib/helper');
const traverson = require('traverson');
const traversonHal = require('traverson-hal');
const Problem = require('../lib/Problem').default;
const emitter = require('../lib/EventEmitter').default;
const TokenStore = require('../lib/TokenStore');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
traverson.registerMediaType(traversonHal.mediaType, traversonHal);

describe('Core', () => {
  let core;
  beforeEach(() => {
    core = new Core.default('https://datamanager.entrecode.de'); // eslint-disable-line new-cap
  });
  it('should be instance of Core', () => {
    core.should.be.instanceOf(Core.default);
  });
  it('should throw on missing url', () => {
    const throws = () => new Core.default();
    throws.should.throw(Error);
  });
  it('should set token', () => {
    const stub = sinon.stub(core.tokenStore, 'set');
    core.setToken('token');
    stub.should.have.been.calledWith('token');
  });
  it('should throw on undefined token', () => {
    const throws = () => core.setToken();
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

describe('Network Helper', () => {
  let traversal;
  let store;
  let spy;
  before(() => {
    nock.disableNetConnect();
    spy = sinon.spy();
    emitter.on('error', spy);
  });
  beforeEach(() => {
    spy.reset();
    store = TokenStore.default('test');
    traversal = traverson.from('https://datamanager.entrecode.de').jsonHal();
  });
  afterEach(() => {
    TokenStore.stores.clear();
  });
  describe('get', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.get('live', traversal).should.be.eventually.fulfilled;
    });
    it('should be resolved with token', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8';
      store.set(token);

      return helper.get('test', traversal)
      .then(() => {
        traversal.should.have.deep.property('requestOptions.headers.Authorization', `Bearer ${token}`);
      });
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.get('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should be rejected network error', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.get('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
      });
    });
    it('should throw missing environment', () => {
      const throws = () => helper.get('live');

      throws.should.throw(Error);
    });
    it('should throw missing traversal', () => {
      const throws = () => helper.get(null, {});

      throws.should.throw(Error);
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.get('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        spy.should.be.called.once;
      });
    });
  });
  describe('getUrl', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.getUrl('live', traversal.follow('ec:dm-stats')).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.getUrl('live', traversal.follow('ec:dm-stats'))
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
      });
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.getUrl('live', traversal.follow('ec:dm-stats'))
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        spy.should.be.called.once;
      });
    });
  });
  describe('post', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.post('live', traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return helper.post('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.post('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        spy.should.be.called.once;
      });
    });
  });
  describe('put', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .put('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.put('live', traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .put('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.put('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .put('/').replyWithError('mocked error');

      return helper.put('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        spy.should.be.called.once;
      });
    });
  });
  describe('delete', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .delete('/').reply(204);

      return helper.del('live', traversal).should.be.eventually.resolved;
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .delete('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.del('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .delete('/').replyWithError('mocked error');

      return helper.del('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        spy.should.be.called.once;
      });
    });
  });
  describe('superagentFormPost', () => {
    it('should be resolved', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').reply(200, { token: 'token' });

      return helper.superagentFormPost('https://datamanager.entrecode.de', {}).should.be.eventually.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.superagentFormPost('https://datamanager.entrecode.de', {}).should.be.eventually.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://datamanager.entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.superagentFormPost('https://datamanager.entrecode.de', {})
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
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
    helper.optionsToQuery(obj).should.have.property('size', 1);
  });
  it('should have page', () => {
    const obj = {
      page: 1,
    };
    helper.optionsToQuery(obj).should.have.property('page', 1);
  });
  it('should sort one item', () => {
    const obj = {
      sort: 'name',
    };
    helper.optionsToQuery(obj).should.have.property('sort', 'name');
  });
  it('should sort multiple items', () => {
    const obj = {
      sort: ['name', '-date'],
    };
    helper.optionsToQuery(obj).should.have.property('sort', 'name,-date');
  });
  it('should throw on invalid sort', () => {
    const throws = () => {
      helper.optionsToQuery({ sort: 1 });
    };
    throws.should.throw(Error);
  });
  it('should have exact filter on string property', () => {
    const obj = {
      filter: {
        property: 'exact',
      },
    };
    helper.optionsToQuery(obj).should.have.property('property', 'exact');
  });
  it('should have exact filter', () => {
    const obj = {
      filter: {
        property: {
          exact: 'value',
        },
      },
    };
    helper.optionsToQuery(obj).should.have.property('property', 'value');
  });
  it('should have search filter', () => {
    const obj = {
      filter: {
        property: {
          search: 'value',
        },
      },
    };
    helper.optionsToQuery(obj).should.have.property('property~', 'value');
  });
  it('should have from filter', () => {
    const obj = {
      filter: {
        property: {
          from: 'value',
        },
      },
    };
    helper.optionsToQuery(obj).should.have.property('propertyFrom', 'value');
  });
  it('should have to filter', () => {
    const obj = {
      filter: {
        property: {
          to: 'value',
        },
      },
    };
    helper.optionsToQuery(obj).should.have.property('propertyTo', 'value');
  });
  it('should have any filter', () => {
    const obj = {
      filter: {
        property: {
          any: ['value1', 'value2'],
        },
      },
    };
    helper.optionsToQuery(obj).should.have.property('property', 'value1,value2');
  });
  it('should throw on any filter not an array', () => {
    const throws = () => {
      helper.optionsToQuery({ filter: { property: { any: 'string' } } });
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
    helper.optionsToQuery(obj).should.have.property('property', 'value1+value2');
  });
  it('should throw on all filter not an array', () => {
    const throws = () => {
      helper.optionsToQuery({ filter: { property: { all: 'string' } } });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid filter object', () => {
    const throws = () => {
      helper.optionsToQuery({ filter: 1 });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid filter property value', () => {
    const throws = () => {
      helper.optionsToQuery({ filter: { property: 1 } });
    };
    throws.should.throw(Error);
  });
  it('should throw on unknown filter type', () => {
    const throws = () => {
      helper.optionsToQuery({ filter: { property: { unknown: '1' } } });
    };
    throws.should.throw(Error);
  });
});
