/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const resolver = require('../mocks/resolver');

const Api = require('../../lib/PublicAPI');
const environmentSymbol = require('../../lib/Core').environmentSymbol;
const resourceSymbol = require('../../lib/Core').resourceSymbol;
const tokenStoreSymbol = require('../../lib/Core').tokenStoreSymbol;
const helper = require('../../lib/helper');
const mock = require('../mocks/nock');

const publicSchema = require('../mocks/public-schema');
const EntryList = require('../../lib/resources/publicAPI/EntryList').default;
const EntryResource = require('../../lib/resources/publicAPI/EntryResource').default;

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
    api[environmentSymbol].should.be.equal('live');
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
      api[resourceSymbol].should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
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
      api[resourceSymbol].should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
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
      api[resourceSymbol].should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
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
    api[tokenStoreSymbol].getClientID().should.be.equal('rest');
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
    api[tokenStoreSymbol].set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    api.setClientID('rest');

    return api.login('user', 'mysecret').should.be.rejectedWith('already logged in or old token present. logout first');
  });
  it('should be rejected on unset clientID', () => {
    api[tokenStoreSymbol].del();
    api[tokenStoreSymbol].clientID = undefined;
    return api.login('user', 'mysecret').should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });
  it('should be rejected on undefined email', () => {
    api[tokenStoreSymbol].del();
    api.setClientID('rest');
    return api.login(null, 'mysecret').should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    api[tokenStoreSymbol].del();
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
    api[tokenStoreSymbol].set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    api[tokenStoreSymbol].clientID = undefined;
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
    api[tokenStoreSymbol].del();
    api[tokenStoreSymbol].has().should.be.false;

    return api.signup('someone@example.com', 'suchsecurewow')
    .then((tokenResponse) => {
      tokenResponse.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
      api[tokenStoreSymbol].has().should.be.true;
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
    api[tokenStoreSymbol].clientID = undefined;
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
    api[tokenStoreSymbol].clientID = undefined;
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
    return api.getSchema('allFields')
    .should.eventually.have.property('id', 'https://datamanager.entrecode.de/api/schema/beefbeef/allFields');
  });
  it('should get schema, method set', () => {
    return api.getSchema('allFields', 'put')
    .should.eventually.have.property('id', 'https://datamanager.entrecode.de/api/schema/beefbeef/allFields?template=put');
  });
  it('should get schema, cached', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(Promise.resolve(publicSchema));

    return api.getSchema('allFields')
    .then(() => api.getSchema('allFields'))
    .then((schema) => {
      schema.should.have.property('id', 'https://datamanager.entrecode.de/api/schema/beefbeef/allFields');
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

  it('should check permission ok', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-permissions.json'));

    return api.checkPermission('entry:get:read')
    .then((ok) => {
      ok.should.be.true;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should check permission not ok', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-permissions.json'));

    return api.checkPermission('nonono')
    .then((ok) => {
      ok.should.be.false;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should check permission cached', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-permissions.json'));
    stub.onThirdCall().throws(new Error('should not happen in tests'));

    return api.checkPermission('entry:get:read')
    .then(() => api.checkPermission('entry:get:read'))
    .then((ok) => {
      ok.should.be.true;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should reject on undefined permission', () => {
    return api.checkPermission()
    .should.be.rejectedWith('permission must be defined');
  });

  it('should resolve on entryList', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry-list.json'));

    return api.entryList('allFields')
    .then((list) => {
      list.should.be.instanceof(EntryList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on undefined model', () => {
    return api.entryList()
    .should.be.rejectedWith('model must be defined');
  });
  it('should throw on filter only id', () => {
    return api.entryList('allFields', { id: '1234567' })
    .should.be.rejectedWith('Providing only an id/_id in entryList filter will result in single resource response. Please use PublicAPI#entry');
  });
  it('should throw on filter only _id', () => {
    return api.entryList('allFields', { _id: '1234567' })
    .should.be.rejectedWith('Providing only an id/_id in entryList filter will result in single resource response. Please use PublicAPI#entry');
  });

  it('should resolve on entry', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry.json'));

    return api.entry('allFields', '1234567')
    .then((entry) => {
      entry.should.be.instanceof(EntryResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on undefined model', () => {
    return api.entry()
    .should.be.rejectedWith('model must be defined');
  });
  it('should throw on undefined id', () => {
    return api.entry('allFields')
    .should.be.rejectedWith('id must be defined');
  });

  it('should create entry', () => {
    const getStub = sinon.stub(helper, 'get');
    getStub.returns(resolver('public-dm-root.json'));
    const postStub = sinon.stub(helper, 'post');
    postStub.returns(resolver('public-entry.json'));

    return api.createEntry('allFields', {
      text: 'hehe',
      formattedText: 'hehe',
      number: 1,
      decimal: 1.1,
      boolean: true,
      datetime: new Date().toISOString(),
      location: {
        latitude: 0,
        longitude: 0,
      },
      email: 'someone@anything.com',
      url: 'https://anything.com',
      phone: '+49 11 8 33',
      json: {},
      entry: '1234567',
      entries: [
        '1234567',
      ],
    })
    .then((entry) => {
      entry.should.be.instanceOf(EntryResource);
      getStub.restore();
      postStub.restore();
    })
    .catch((err) => {
      getStub.restore();
      postStub.restore();
      throw err;
    });
  });
  it('should throw on undefined model', () => {
    return api.createEntry()
    .should.be.rejectedWith('model must be defined');
  });
  it('should throw on undefined entry', () => {
    return api.createEntry('allFields')
    .should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should throw on invalid entry', () => {
    return api.createEntry('allFields', {})
    .should.be.rejectedWith('JSON Schema Validation error');
  });
});
