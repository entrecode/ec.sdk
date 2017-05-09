/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const resolver = require('../mocks/resolver');

const Api = require('../../lib/PublicAPI');
const helper = require('../../lib/helper');
const mock = require('../mocks/nock');

const publicSchema = require('../mocks/public-schema');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
nock.disableNetConnect();

describe('PublicAPI', () => {
  let api;
  beforeEach(() => {
    api = new Api.default('beefbeef', 'live'); // eslint-disable-line new-cap
    mock.reset();
  });
  it('should be instance of PublicAPI', () => {
    api.should.be.instanceOf(Api.default);
  });
  it('should be instance of PublicAPI with live env', () => {
    api = new Api.default('beefbeef'); // eslint-disable-line new-cap
    api.should.be.instanceOf(Api.default);
    api.environment.should.be.equal('live');
  });
  it('should throw on missing id', () => {
    const throws = () => new Api.default(); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should throw on invalid id', () => {
    const throws = () => new Api.default('notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should throw on invalid environment', () => {
    const throws = () => new Api.default('beefbeef', 'notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });

  ['dataManagerID', 'title', 'description', 'locales',
    'defaultLocale', 'models', 'account', 'config']
  .forEach((property) => {
    it(`getter for ${property}`, () => {
      const stub = sinon.stub(helper, 'get');
      stub.returns(resolver('public-dm-root.json'));

      return api.resolve()
      .then(() => {
        api[property].should.be.defined;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
    });
  });

  it('should resolve data manager root response', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.resolve()
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve data manager root response cache', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().throws(new Error('should not happen in tests'));

    return api.resolve()
    .then(() => api.resolve())
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve data manager root response cache reload', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-dm-root.json'));
    stub.onThirdCall().throws(new Error('should not happen in tests'));

    return api.resolve()
    .then(() => api.resolve(true))
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load modelLst', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.modelList()
    .then((list) => {
      list.should.be.instanceOf(Object);
      list.should.have.property('allFields');
      // TODO properties should be model objects
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load me', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.me()
    .then((me) => {
      me.should.be.instanceOf(Object);
      me.should.have.property('accountID', '49518e7d-a8b0-444a-b829-7fe3c86810ab');
      // TODO properties should be model objects
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  it('should set clientID', () => {
    api.setClientID('rest');
    api.tokenStore.getClientID().should.be.equal('rest');
  });
  it('should throw on undefined clientID', () => {
    const throws = () => api.setClientID(); // eslint-disable-line new-cap
    throws.should.throw('ClientID must be defined');
  });
  it('should throw on not rest clientID', () => {
    const throws = () => api.setClientID('notrest'); // eslint-disable-line new-cap
    throws.should.throw('ec.sdk currently only supports client');
  });

  it('should login successfully', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-register.json'));

    api.setClientID('rest');
    return api.login('andre@entrecode.de', 'mysecret').should.eventually.be.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should reject when already logged in', () => {
    api.tokenStore.set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    api.setClientID('rest');

    return api.login('user', 'mysecret').should.be.rejectedWith('already logged in or old token present. logout first');
  });
  it('should be rejected on unset clientID', () => {
    api.tokenStore.del();
    api.tokenStore.clientID = undefined;
    return api.login('user', 'mysecret').should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });
  it('should be rejected on undefined email', () => {
    api.tokenStore.del();
    api.setClientID('rest');
    return api.login(null, 'mysecret').should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    api.tokenStore.del();
    api.setClientID('rest');
    return api.setClientID('rest').login('user', null).should.be.rejectedWith('password must be defined');
  });
  it('should logout successfully', () => {
    api.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'post');
    stub.returns(Promise.resolve());

    return api.logout().should.be.eventually.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should be successful on no token', () => {
    return api.logout().should.be.eventually.fullfilled;
  });
  it('should be rejected on unset clientID', () => {
    api.tokenStore.set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    api.tokenStore.clientID = undefined;
    return api.logout().should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should return true on email available', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('email-available.json'));
    const follow = sinon.stub(api, 'follow');
    follow.returns(Promise.resolve(api.newRequest()));

    return api.emailAvailable('someone@example.com').should.be.eventually.equal(true)
    .and.notify(() => {
      stub.restore();
      follow.restore();
    });
  });
  it('should be rejected on undefined email', () => {
    return api.emailAvailable().should.be.rejectedWith('email must be defined');
  });

  it('should signup new account', () => {
    api.setClientID('rest');
    const url = sinon.stub(helper, 'getUrl');
    url.returns(Promise.resolve('https://accounts.entrecode.de/auth/signup?clientID=rest'));
    const token = sinon.stub(helper, 'superagentFormPost');
    token.returns(Promise.resolve({ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8' }));
    api.tokenStore.del();
    api.tokenStore.has().should.be.false;

    return api.signup('someone@example.com', 'suchsecurewow')
    .then((tokenResponse) => {
      tokenResponse.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
      api.tokenStore.has().should.be.true;
      token.restore();
      url.restore();
    })
    .catch((err) => {
      token.restore();
      url.restore();
      throw err;
    });
  });
  it('should be rejected on undefined email', () => {
    return api.signup(null, 'supersecure')
    .should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    return api.signup('someone@example.com', null)
    .should.be.rejectedWith('password must be defined');
  });
  it('should be rejected on undefined clientID', () => {
    api.tokenStore.clientID = undefined;
    return api.signup('someone@example.com', 'supersecure')
    .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should reset password', () => {
    api.setClientID('rest');
    const stub = sinon.stub(helper, 'getEmpty');
    stub.returns(Promise.resolve());

    return api.resetPassword('someone@entrecode.de')
    .then(() => {
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined email', () => {
    return api.resetPassword().should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefiend clientID', () => {
    api.tokenStore.clientID = undefined;
    return api.resetPassword('someone@entrecode.de')
    .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should create anonymous', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-create-anon.json'));

    return api.createAnonymous()
    .should.eventually.have.property('accountID', 'b6d0671d-17f3-43b7-9eb2-e2b0e4040015')
    .and.notify(() => stub.restore());
  });
  it('should create anonymous, validUntil', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-create-anon.json'));

    return api.createAnonymous(new Date())
    .should.eventually.have.property('accountID', 'b6d0671d-17f3-43b7-9eb2-e2b0e4040015')
    .and.notify(() => stub.restore());
  });

  it('should get schema', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(Promise.resolve(publicSchema));

    return api.getSchema('allFields')
    .then((schema) => {
      schema.should.have.property('id', 'https://datamanager.entrecode.de/api/schema/01bd8e08/allFields');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should get schema, method set', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(Promise.resolve(publicSchema));

    return api.getSchema('allFields', 'put')
    .then((schema) => {
      schema.should.have.property('id', 'https://datamanager.entrecode.de/api/schema/01bd8e08/allFields');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should get schema, cached', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(Promise.resolve(publicSchema));

    return api.getSchema('allFields')
    .then(() => api.getSchema('allFields'))
    .then((schema) => {
      schema.should.have.property('id', 'https://datamanager.entrecode.de/api/schema/01bd8e08/allFields');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should reject on undefined model', () => {
    return api.getSchema().should.be.rejectedWith('model must be defined');
  });
  it('should reject on invalid method', () => {
    return api.getSchema('allFields', 'patch')
    .should.be.rejectedWith('invalid method, only: get, post, and put');
  });
});
