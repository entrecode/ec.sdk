/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const superagent = require('superagent');

const Core = require('../lib/Core');
const helper = require('../lib/helper');
const traverson = require('traverson');
const traversonHal = require('traverson-hal');
const packageJson = require('../package.json');
const Problem = require('../lib/Problem').default;
const emitter = require('../lib/EventEmitter').default;
const TokenStore = require('../lib/TokenStore');

const nockMock = require('./mocks/nock');
const resolver = require('./mocks/resolver');
const TraversonMock = require('./mocks/TraversonMock');

nock.disableNetConnect();
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
traverson.registerMediaType(traversonHal.mediaType, traversonHal);

describe('Core', () => {
  let core;
  beforeEach(() => {
    core = new Core.default({ live: 'https://datamanager.entrecode.de' }); // eslint-disable-line
                                                                           // new-cap
    nockMock.reset();
  });
  it('should be instance of Core', () => {
    core.should.be.instanceOf(Core.default);
  });
  it('should throw on missing url', () => {
    const throws = () => new Core.default();
    throws.should.throw(Error);
  });
  it('should set token', () => {
    const stub = sinon.stub(core[Core.tokenStoreSymbol], 'setToken');
    core.setToken('token');
    stub.should.have.been.calledWith('token');
    stub.restore();
  });
  it('should throw on undefined token', () => {
    const throws = () => core.setToken();
    throws.should.throw(Error);
  });
  it('should get token, with token', () => {
    core[Core.tokenStoreSymbol].token = 'token';
    core.getToken().should.be.equal('token');
  });
  it('should set user agent', () => {
    const stub = sinon.stub(core[Core.tokenStoreSymbol], 'setUserAgent');
    core.setUserAgent('useragent');
    stub.should.have.been.calledWith('useragent');
    stub.restore();
  });
  it('should throw on undefined user agent', () => {
    const throws = () => core.setUserAgent();
    throws.should.throw(Error);
  });
  it('should return traverson Builder newRequest', () => {
    core.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should return traverson Builder newRequest with continue', () => {
    // simulate traversal with continue
    core[Core.traversalSymbol].continue = () => core[Core.traversalSymbol];
    core.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should return traverson Builder follow', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('dm-list.json'));
    stub.onSecondCall().throws(new Error('not in tests my friend'));

    return core.follow('ec:dm-stats').should.eventually.be.instanceOf(TraversonMock)
    .notify(() => stub.restore());
  });
  it('should return traverson Builder follow cached', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('dm-list.json'));
    stub.onSecondCall().throws(new Error('not in tests my friend'));

    return core.follow('ec:dm-stats')
    .then(() => core.follow('ec:dm-stats')
    .should.eventually.be.instanceOf(TraversonMock)
    .notify(() => stub.restore()));
  });
  it('should reject on follow missing link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('dm-list.json'));
    stub.onSecondCall().returns(resolver('dm-list.json'));
    stub.onThirdCall().throws(new Error('not in tests my friend'));

    return core.follow('ec:dm-stats')
    .then(() => core.follow('missing')
    .should.be.rejectedWith('Could not follow missing. Link not present in root response.')
    .notify(() => stub.restore()));
  });
  it('should return link', () => {
    core.environment = 'live';
    return core.link('ec:dm-stats').should.eventually
    .have.property('href', 'https://datamanager.entrecode.de/stats{?dataManagerID}');
  });
  it('should return link cached', () => {
    core.environment = 'live';
    return core.link('ec:dm-stats')
    .then(() => core.link('ec:dm-stats').should.eventually
    .have.property('href', 'https://datamanager.entrecode.de/stats{?dataManagerID}'));
  });
  it('should reject on link missing link', () => {
    core.environment = 'live';
    return core.link('ec:dm-stats')
    .then(() => core.link('missing').should.be.rejectedWith('Could not get missing. Link not present in root response.'));
  });
  it('should throw on undefined traversal', () => {
    const throws = () => {
      core[Core.traversalSymbol] = null;
      core.newRequest();
    };
    throws.should.throw(Error);
  });
  it('should attach listener', () => {
    core.on('attachTest', () => undefined);
    emitter.listeners.get('attachTest').length.should.be.equal(1);
  });
  it('should remove listener', () => {
    const listener = () => undefined;
    core.on('removeTest', listener);
    emitter.listeners.get('removeTest').length.should.be.equal(1);
    core.removeListener('removeTest', listener);
    emitter.listeners.get('removeTest').length.should.be.equal(0);
  });
  it('should preload schema', () => {
    nock('https://entrecode.de/')
    .get('/schema/error')
    .reply(200, {
      $schema: 'http://json-schema.org/draft-04/schema#',
      id: 'https://entrecode.de/schema/error',
    });

    return core.preloadSchemas('https://entrecode.de/schema/error').should.be.fulfilled;
  });
  it('should preload schemas', () => {
    nock('https://entrecode.de/')
    .get('/schema/error')
    .times(2)
    .reply(200, {
      $schema: 'http://json-schema.org/draft-04/schema#',
      id: 'https://entrecode.de/schema/error',
    });

    return core.preloadSchemas([
      'https://entrecode.de/schema/error',
      'https://entrecode.de/schema/error',
    ]).should.be.fulfilled;
  });
});

describe('Network Helper', () => {
  let traversal;
  let store;
  let errorSpy;
  let loggedOutSpy;
  before(() => {
    nock.disableNetConnect();
    errorSpy = sinon.spy();
    loggedOutSpy = sinon.spy();
    emitter.on('error', errorSpy);
    emitter.on('logout', loggedOutSpy);
  });
  beforeEach(() => {
    errorSpy.reset();
    loggedOutSpy.reset();
    store = TokenStore.default('test');
    traversal = traverson.from('https://entrecode.de').jsonHal();
  });
  afterEach(() => {
    TokenStore.stores.clear();
  });
  describe('get', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.get('live', traversal).should.be.eventually.fulfilled;
    });
    it('should be resolved with token', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8';
      store.setToken(token);

      return helper.get('test', traversal)
      .then(() => {
        traversal.should.have.nested.property('requestOptions.headers.Authorization', `Bearer ${token}`);
      });
    });
    it('should be resolved with token, first load from publicToken store', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8';
      store.setToken(token);

      return helper.get('testbeefbeef', traversal)
      .then(() => {
        traversal.should.have.nested.property('requestOptions.headers.Authorization', `Bearer ${token}`);
      });
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .get('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.get('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should be rejected network error', () => {
      nock('https://entrecode.de')
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
      nock('https://entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.get('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
    it('should fire loggedOut event on ec.402 error', () => {
      nock('https://entrecode.de')
      .get('/').reply(401, {
        title: 'Outdated Access Token',
        code: 2402,
        status: 401,
      });

      return helper.get('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('title', 'Outdated Access Token');
        loggedOutSpy.should.be.calledOnce;
      });
    });
    it('should fire loggedOut event on ec.401 error', () => {
      TokenStore.default();
      nock('https://entrecode.de')
      .get('/').reply(401, {
        title: 'Invalid Access Token',
        code: 2401,
        status: 401,
      });

      return helper.get('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('title', 'Invalid Access Token');
        loggedOutSpy.should.be.calledOnce;
      });
    });
    it('should add user agent', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.get('test', traversal)
      .then(() => {
        traversal.should.have.nested.property('requestOptions.headers.X-User-Agent', `ec.sdk/${packageJson.version}`);
      });
    });
    it('should add custom user agent', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      store.agent = 'test/0.0.1';

      return helper.get('test', traversal)
      .then(() => {
        traversal.should.have.nested.property('requestOptions.headers.X-User-Agent', `test/0.0.1 ec.sdk/${packageJson.version}`);
      });
    });
    it('should add custom user agent, from secondStore', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      store.agent = 'test/0.0.1';

      return helper.get('testbeefbeef', traversal)
      .then(() => {
        traversal.should.have.nested.property('requestOptions.headers.X-User-Agent', `test/0.0.1 ec.sdk/${packageJson.version}`);
      });
    });
  });
  describe('getUrl', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .get('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.getUrl('live', traversal.follow('ec:dm-stats')).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
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
      nock('https://entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.getUrl('live', traversal.follow('ec:dm-stats'))
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('getEmpty', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .get('/').reply(204);

      return helper.getEmpty('live', traversal).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .get('/').reply(404, 'mocked error');

      return helper.getEmpty('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
      });
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.getEmpty('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('postEmpty', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .post('/').reply(204);

      return helper.postEmpty('live', traversal, {}).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .post('/').reply(404, 'mocked error');

      return helper.postEmpty('live', traversal, {})
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
      });
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.postEmpty('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('post', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .post('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.post('live', traversal).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });
      return helper.post('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.post('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('put', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .put('/').replyWithFile(200, `${__dirname}/mocks/dm-list.json`);

      return helper.put('live', traversal).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .put('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.put('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .put('/').replyWithError('mocked error');

      return helper.put('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('delete', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .delete('/').reply(204);

      return helper.del('live', traversal).should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .delete('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.del('live', traversal).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .delete('/').replyWithError('mocked error');

      return helper.del('live', traversal)
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('superagentFormPost', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .post('/').reply(200, { token: 'token' });

      return helper.superagentFormPost('https://entrecode.de', {}).should.be.eventually.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.superagentFormPost('https://entrecode.de', {}).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.superagentFormPost('https://entrecode.de', {})
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('superagentGet', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .get('/').reply(200, { url: 'http://example.com' });

      return helper.superagentGet('https://entrecode.de').should.be.eventually.fulfilled;
    });
    it('should be resolved with headers', () => {
      nock('https://entrecode.de')
      .get('/').reply(200, { url: 'http://example.com' });

      return helper.superagentGet('https://entrecode.de', {}).should.be.eventually.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .get('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      }, { 'Content-Type': 'application/json' });

      return helper.superagentGet('https://entrecode.de', {}).should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .get('/').replyWithError('mocked error');

      return helper.superagentGet('https://entrecode.de', {})
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('superagentPost', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .post('/').reply(200, {});

      return helper.superagentPost('live', superagent.post('https://entrecode.de'))
        .should.be.eventually.be.fulfilled;
    });
    it('should be resolved with token and user agent', () => {
      nock('https://entrecode.de')
      .post('/').reply(200, {});

      const liveStore = TokenStore.default('live');
      liveStore.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
      liveStore.setUserAgent('agent/1.0.0');

      return helper.superagentPost('live', superagent.post('https://entrecode.de'))
        .should.be.eventually.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .post('/').reply(404, {
        title: 'not found',
        code: 2102,
        status: 404,
        detail: 'title',
      });

      return helper.superagentPost('live', superagent.post('https://entrecode.de'))
      .should.be.rejectedWith(Problem);
    });
    it('should fire error event', () => {
      nock('https://entrecode.de')
      .post('/').replyWithError('mocked error');

      return helper.superagentPost('live', superagent.post('https://entrecode.de'))
      .then(() => {
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        err.should.have.property('message', 'mocked error');
        errorSpy.should.be.calledOnce;
      });
    });
  });
  describe('superagentGetPiped', () => {
    it('should be resolved', () => {
      nock('https://entrecode.de')
      .get('/asset/download')
      .reply(200, () => fs.createReadStream(`${__dirname}/mocks/test.png`));

      return helper.superagentGetPiped('https://entrecode.de/asset/download', fs.createWriteStream('/dev/null'))
        .should.eventually.be.be.fulfilled;
    });
    it('should be rejected', () => {
      nock('https://entrecode.de')
      .get('/asset/download')
      .replyWithError('mocked error');

      return helper.superagentGetPiped('https://entrecode.de/asset/download', fs.createWriteStream('/dev/null'))
      .should.eventually.be.rejectedWith('mocked error');
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
  it('should throw on size not an integer', () => {
    const throws = () => {
      helper.optionsToQuery({ size: 'string' });
    };
    throws.should.throw(Error);
  });
  it('should have page', () => {
    const obj = {
      page: 1,
    };
    helper.optionsToQuery(obj).should.have.property('page', 1);
  });
  it('should throw on page not an integer', () => {
    const throws = () => {
      helper.optionsToQuery({ page: 'string' });
    };
    throws.should.throw(Error);
  });
  it('should have levels', () => {
    const obj = {
      _levels: 5,
    };
    helper.optionsToQuery(obj).should.have.property('_levels', 5);
  });
  it('should not have levels, 1', () => {
    const obj = {
      _levels: 1,
    };
    helper.optionsToQuery(obj).should.not.have.property('_levels');
  });
  it('should not have levels, 6', () => {
    const obj = {
      _levels: 6,
    };
    helper.optionsToQuery(obj).should.not.have.property('_levels');
  });
  it('should throw on invalid levels, NaN', () => {
    const throws = () => {
      helper.optionsToQuery({ _levels: 'string' });
    };
    throws.should.throw(Error);
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
  it('should have _fields filter', () => {
    const obj = {
      _fields: ['aField', 'anotherField'],
    };
    helper.optionsToQuery(obj).should.have.property('_fields', 'aField,anotherField');
  });
  it('should throw on invalid _fields', () => {
    const throws = () => {
      helper.optionsToQuery({ _fields: 'notAnArray' });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid _fields items', () => {
    const throws = () => {
      helper.optionsToQuery({ _fields: [{}] });
    };
    throws.should.throw(Error);
  });
  it('should have exact filter on string property', () => {
    const obj = { property: 'exact' };
    helper.optionsToQuery(obj).should.have.property('property', 'exact');
  });
  it('should have exact filter on number property', () => {
    const obj = { property: 0 };
    helper.optionsToQuery(obj).should.have.property('property', 0);
  });
  it('should have exact filter on boolean property', () => {
    const obj = { property: true };
    helper.optionsToQuery(obj).should.have.property('property', true);
  });
  it('should have exact filter on date property', () => {
    const date = new Date();
    const obj = { property: date };
    helper.optionsToQuery(obj).should.have.property('property', date.toISOString());
  });
  it('should have exact filter', () => {
    const obj = { property: { exact: 'value' } };
    helper.optionsToQuery(obj).should.have.property('property', 'value');
  });
  it('should have exact filter with date', () => {
    const date = new Date()
    const obj = { property: { exact: date } };
    helper.optionsToQuery(obj).should.have.property('property', date.toISOString());
  });
  it('should throw on array exact filter', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { exact: [] } });
    };
    throws.should.throw(Error);
  });
  it('should have search filter', () => {
    const obj = { property: { search: 'value' } };
    helper.optionsToQuery(obj).should.have.property('property~', 'value');
  });
  it('should have from filter', () => {
    const obj = { property: { from: 'value' } };
    helper.optionsToQuery(obj).should.have.property('propertyFrom', 'value');
  });
  it('should have to filter', () => {
    const obj = { property: { to: 'value' } };
    helper.optionsToQuery(obj).should.have.property('propertyTo', 'value');
  });
  it('should have any filter', () => {
    const obj = { property: { any: ['value1', 'value2'] } };
    helper.optionsToQuery(obj).should.have.property('property', 'value1,value2');
  });
  it('should throw on any filter not an array', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { any: 'string' } });
    };
    throws.should.throw(Error);
  });
  it('should throw on any filter invalid item', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { any: [{}] } });
    };
    throws.should.throw(Error);
  });
  it('should have all filter', () => {
    const obj = { property: { all: ['value1', 'value2'] } };
    helper.optionsToQuery(obj).should.have.property('property', 'value1+value2');
  });
  it('should throw on all filter not an array', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { all: 'string' } });
    };
    throws.should.throw(Error);
  });
  it('should throw on all filter invalid item', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { all: [{}] } });
    };
    throws.should.throw(Error);
  });
  it('should throw on invalid filter property value', () => {
    const throws = () => {
      helper.optionsToQuery({
        property: () => {
        }
      });
    };
    throws.should.throw(Error);
  });
  it('should throw on unknown filter type', () => {
    const throws = () => {
      helper.optionsToQuery({ property: { unknown: '1' } });
    };
    throws.should.throw(Error);
  });
  describe('template validation', () => {
    it('valid, all types', () => {
      const obj = {
        size: 1,
        page: 1,
        sort: ['field'],
        field: {
          to: 'to',
          from: 'from',
          exact: 'exact',
          search: 'search',
        },
      };
      (() => helper.optionsToQuery(obj, '{?size,page,sort,field,fieldTo,fieldFrom,field~}'))
      .should.not.throw();
    });
    it('invalid, all types', () => {
      const obj = {
        size: 1,
        page: 1,
        sort: ['field'],
        field: {
          to: 'to',
          from: 'from',
          exact: 'exact',
          search: 'search',
        },
      };
      try {
        helper.optionsToQuery(obj, '{?other}');
      } catch (e) {
        e.should.have.property('array');
        return e.array.should.have.property('length', 7);
      }
      throw new Error('failed');
    });
  });
});
