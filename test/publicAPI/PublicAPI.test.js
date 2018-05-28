/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const resolver = require('../mocks/resolver');

const Api = require('../../lib/PublicAPI');
const helper = require('../../lib/helper');

const mock = require('../mocks/nock');
const fdMock = require('./../mocks/formData.mock.js');

const publicSchema = require('../mocks/public-schema');
const EntryList = require('../../lib/resources/publicAPI/EntryList').default;
const EntryResource = require('../../lib/resources/publicAPI/EntryResource').default;
const PublicAssetList = require('../../lib/resources/publicAPI/PublicAssetList').default;
const PublicAssetResource = require('../../lib/resources/publicAPI/PublicAssetResource').default;
const DMAssetList = require('../../lib/resources/publicAPI/DMAssetList').default;
const DMAssetResource = require('../../lib/resources/publicAPI/DMAssetResource').default;

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');
const tokenStoreSymbol = Symbol.for('tokenStore');

const should = chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
nock.disableNetConnect();

describe('PublicAPI', () => {
  let api;
  beforeEach(() => {
    api = new Api.default('beefbeef', { environment: 'live', noCookie: true }); // eslint-disable-line new-cap
    mock.reset();
  });
  it('should be instance of PublicAPI', () => {
    api.should.be.instanceOf(Api.default);
  });
  it('should be instance of PublicAPI with live env', () => {
    api = new Api.default('beefbeef'); // eslint-disable-line new-cap
    api.should.be.instanceOf(Api.default);
    api[environmentSymbol].should.be.equal('livebeefbeef');
  });
  it('should be instance of PublicAPI with stage env and ecUser', () => {
    api = new Api.default('beefbeef', 'stage', true); // eslint-disable-line new-cap
    api.should.be.instanceOf(Api.default);
    api[environmentSymbol].should.be.equal('stage');
  });
  it('should get auth link', () => {
    api.getAuthLink('anonymous').should.eventually.be.fulfilled;
  });
  it('should throw on missing id', () => {
    const throws = () => new Api.default(); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should throw on invalid id', () => {
    const throws = () => new Api.default('notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should create instance live', function () {
    const a = new Api.default('https://datamanager.entrecode.de/api/beefbeef', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('live');
  });
  it('should create instance stage', function () {
    const a = new Api.default('https://datamanager.cachena.entrecode.de/api/beefbeef/', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('stage');
  });
  it('should create instance nightly', function () {
    const a = new Api.default('https://datamanager.buffalo.entrecode.de/api/beefbeef', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('nightly');
  });
  it('should create instance develop', function () {
    const a = new Api.default('http://localhost:7471/api/beefbeef', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('develop');
  });
  it('should throw on invalid environment', () => {
    const throws = () => new Api.default('beefbeef', 'notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should return shortID on shortID', () => {
    api.shortID.should.be.equal('beefbeef');
  });

  ['dataManagerID', 'title', 'description', 'locales',
    'defaultLocale', 'models', 'account', 'config']
    .forEach((property) => {
      it(`getter for ${property}`, () => {
        const stub = sinon.stub(helper, 'get');
        stub.returns(resolver('public-dm-root.json'));

        return api.resolve()
          .then(() => {
            api[property].should.exist;
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
  it('should load modelList', () => {
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
  it('should load assetGroupList', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.assetGroupList()
      .then((list) => {
        list.should.be.instanceOf(Array);
        list.should.have.property('length', 1);
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

    return api
      .setToken('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6bnVsbCwianRpIjoiMTZiYjVmNDUtMTc0Ny00YjQ4LWEwMTItYjhkYjBkMDE1NDVjIiwiaWF0IjoxNTIzODY2NzM2LCJleHAiOjQ2Nzc0NjY3MzYsImlzcyI6ImVjX2FkbWluIiwic3ViIjoiMzk4MWI3YzktMzNlOC00MDg0LWI4YTYtMDU2NDBjNzUwNTZmIn0.nWturDuNcjlEE99YKCWXxwyi6gV9wKrSZg4o2nfFhG4Xtb8LzdUQKtmNGTHiBIjIkeHm2dH6RO5sTGIZboiJfLePGzE8UVYmx_e5GbfCz_gq636lFHl6fUGUdD-dwGvB65L5nWsJ-eEvYEbuQz_tuK6j1aLGmnOnSPjlCqdbE_Y')
      .me()
      .then((me) => {
        me.should.be.instanceOf(Object);
        me.should.have.property('accountID', '49518e7d-a8b0-444a-b829-7fe3c86810ab');
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
    api[tokenStoreSymbol].setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    api.setClientID('rest');

    return api.login('user', 'mysecret').should.be.rejectedWith('already logged in or old token present. logout first');
  });
  it('should be rejected on unset clientID', () => {
    api[tokenStoreSymbol].deleteToken();
    api[tokenStoreSymbol].clientID = undefined;
    return api.login('user', 'mysecret').should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });
  it('should be rejected on undefined email', () => {
    api[tokenStoreSymbol].deleteToken();
    api.setClientID('rest');
    return api.login(null, 'mysecret').should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    api[tokenStoreSymbol].deleteToken();
    api.setClientID('rest');
    return api.setClientID('rest').login('user', null).should.be.rejectedWith('password must be defined');
  });
  it('should logout successfully', () => {
    api.setClientID('rest');
    api.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'post');
    stub.returns(Promise.resolve());

    return api.logout().should.be.eventually.fulfilled
      .and.notify(() => stub.restore());
  });
  it('should be successful on no token', () => {
    return api.logout().should.be.eventually.fulfilled;
  });
  it('should be rejected on unset clientID', () => {
    api[tokenStoreSymbol].setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
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
    api[tokenStoreSymbol].deleteToken();
    api[tokenStoreSymbol].hasToken().should.be.false;

    return api.signup('someone@example.com', 'suchsecurewow')
      .then((tokenResponse) => {
        tokenResponse.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
        api[tokenStoreSymbol].hasToken().should.be.true;
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
        stub.should.have.callCount(2);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should check permission cached, refresh', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-permissions.json'));
    stub.onThirdCall().returns(resolver('public-permissions.json'));

    return api.checkPermission('entry:get:read')
      .then(() => api.checkPermission('entry:get:read', true))
      .then((ok) => {
        ok.should.be.true;
        stub.should.have.callCount(3);
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

    return api.entry('allFields', '1234567', { _fields: ['a', 'b'] })
      .then((entry) => {
        entry.should.be.instanceof(EntryResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should resolve on entry, level ', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry.json'));

    return api.entry('allFields', '1234567', 2)
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
  it('should throw on invalid _levels', () => {
    return api.entry('allFields', '1234567', { _levels: 'string' })
      .should.be.rejectedWith('_levels must be integer');
  });
  it('should throw on invalid _fields', () => {
    return api.entry('allFields', '1234567', { _fields: 'string' })
      .should.be.rejectedWith('_fields must be Array<string>');
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
  it('should create entry', () => {
    const getStub = sinon.stub(helper, 'get');
    getStub.returns(resolver('public-dm-root.json'));
    const postStub = sinon.stub(helper, 'post');
    postStub.returns([]);

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
        should.equal(entry, undefined);
        getStub.restore();
        postStub.restore();
      })
      .catch((err) => {
        getStub.restore();
        postStub.restore();
        throw err;
      });
  });
  it('should create entry, levels', () => {
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
    }, 1)
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
      .should.be.rejectedWith('Missing property in JSON body');
  });
  it('should throw on levels 0', () => {
    return api.createEntry('allFields', {}, 0)
      .should.be.rejectedWith('levels must be between 1 and 5');
  });
  it('should throw on levels 5', () => {
    return api.createEntry('allFields', {}, 5)
      .should.be.rejectedWith('levels must be between 1 and 5');
  });

  it('should load asset list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('asset-list.json'));

    return api.assetList()
      .then((list) => {
        list.should.be.instanceof(PublicAssetList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on asset list filtered with assetID', () => {
    return api.assetList({ assetID: 'id' })
      .should.be.rejectedWith('Cannot filter assetList only by assetID. Use PublicAPI#asset() instead');
  });
  it('should load asset resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-single.json'));

    return api.asset('id')
      .then((model) => {
        model.should.be.instanceof(PublicAssetResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined assetID', () => {
    return api.asset().should.be.rejectedWith('assetID must be defined');
  });

  it('should create asset, path', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
        },
      },
    }));
    const stubGet = sinon.stub(helper, 'get');
    stubGet.onFirstCall().returns(resolver('public-dm-root.json'));
    stubGet.onSecondCall().returns(resolver('public-asset.json'));

    return api.createAsset(`${__dirname}/../mocks/test.png`)
      .then(response => response())
      .then((response) => {
        response.should.be.instanceof(PublicAssetResource);
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        stubGet.restore();
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        stubGet.restore();
        throw err;
      });
  });
  it('should create asset, buffer, title and tags', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
        },
      },
    }));

    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/test.png`, (err, file) => {
        if (err) {
          return reject(err);
        }
        return resolve(file);
      });
    })
      .then(file => api.createAsset(file, {
        fileName: 'test.png',
        title: 'hello',
        tags: ['helloTag'],
      }))
      .then((response) => {
        response.should.be.a('function');
        stubGetUrl.restore();
        stubSuperagentPost.restore();
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        throw err;
      });
  });
  it('should be rejected on create with buffer and no file name', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));

    return api.createAsset(new Buffer([]))
      .then(() => {
        throw new Error('Unexpectedly resolved');
      })
      .catch((err) => {
        stubGetUrl.restore();
        if (err.message === 'Unexpectedly resolved') {
          throw err;
        }
        err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
      });
  });
  it('should create asset, FormData (mock), title and tags', () => {
    global.FormData = fdMock;
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
        },
      },
    }));

    return api.createAsset(new FormData(), { // eslint-disable-line no-undef
      title: 'hello',
      tags: ['whatwhat'],
    })
      .then((response) => {
        response.should.be.a('function');
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        global.FormData = undefined;
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        global.FormData = undefined;
        throw err;
      });
  });
  it('should be rejected on create asset with undefined value', () => {
    return api.createAsset().should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should be rejected on create asset with unsupported value', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    return api.createAsset([]).should.be.rejectedWith('Cannot handle input.')
      .notify(() => stubGetUrl.restore());
  });

  it('should create assets, path', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
        ],
      },
    }));
    const stubGet = sinon.stub(helper, 'get');
    stubGet.onFirstCall().returns(resolver('public-dm-root.json'));
    stubGet.onSecondCall().returns(resolver('public-asset-list.json'));

    return api.createAssets([`${__dirname}/../mocks/test.png`, `${__dirname}/../mocks/test.png`])
      .then(response => response())
      .then((response) => {
        response.should.be.instanceof(PublicAssetList);
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        stubGet.restore();
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        stubGet.restore();
        throw err;
      });
  });
  it('should create assets, buffer, title and tags', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
        ],
      },
    }));

    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/test.png`, (err, file) => {
        if (err) {
          return reject(err);
        }
        return resolve(file);
      });
    })
      .then(file => api.createAssets([file, file], {
        fileName: ['test.png', 'test.png'],
        title: 'hello',
        tags: ['helloTag'],
      }))
      .then((response) => {
        response.should.be.a('function');
        stubGetUrl.restore();
        stubSuperagentPost.restore();
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        throw err;
      });
  });
  it('should be rejected on create assets with buffer and no file name #1', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));

    return api.createAssets([new Buffer([])])
      .then(() => {
        throw new Error('Unexpectedly resolved');
      })
      .catch((err) => {
        stubGetUrl.restore();
        if (err.message === 'Unexpectedly resolved') {
          throw err;
        }
        err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
      });
  });
  it('should be rejected on create assets with buffer and no file name #2', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));

    return api.createAssets([new Buffer([])], { fileName: 'string' })
      .then(() => {
        throw new Error('Unexpectedly resolved');
      })
      .catch((err) => {
        stubGetUrl.restore();
        if (err.message === 'Unexpectedly resolved') {
          throw err;
        }
        err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
      });
  });
  it('should be rejected on create assets with buffer and no file name #3', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));

    return api.createAssets([new Buffer([])], { fileName: [] })
      .then(() => {
        throw new Error('Unexpectedly resolved');
      })
      .catch((err) => {
        stubGetUrl.restore();
        if (err.message === 'Unexpectedly resolved') {
          throw err;
        }
        err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
      });
  });
  it('should create assets, FormData (mock), title and tags', () => {
    global.FormData = fdMock;
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('hhttps://datamanager.entrecode.de/asset/beefbeef'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
          {
            href: 'https://datamanager.entrecode.de/asset/beefbeef?assetID=d845a328-0ea4-475a-b593-bae9df92a11a',
          },
        ],
      },
    }));

    return api.createAssets(new FormData(), { // eslint-disable-line no-undef
      title: 'hello',
      tags: ['whatwhat'],
    })
      .then((response) => {
        response.should.be.a('function');
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        global.FormData = undefined;
      })
      .catch((err) => {
        stubGetUrl.restore();
        stubSuperagentPost.restore();
        global.FormData = undefined;
        throw err;
      });
  });
  it('should be rejected on create assets with undefined value', () => {
    return api.createAssets().should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should be rejected on create assets with unsupported value', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
    return api.createAssets([[]]).should.be.rejectedWith('Cannot handle input.')
      .notify(() => stubGetUrl.restore());
  });

  it('should get best file', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getFileUrl('e766d956-6f43-49fa-8f30-023e4cd29779')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best file assetNeue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getFileUrl('notUUID')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get error on 404', () => {
    mock.reset();
    return api.getFileUrl('8e2ef37e-68f8-46c7-b4ba-e9f44bc00257')
      .should.eventually.be.rejectedWith('Resource not found');
  });
  it('should be rejected on undefined assetID', () => {
    return api.getFileUrl()
      .should.be.rejectedWith('assetID must be defined');
  });
  it('should get best image', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getImageUrl('e766d956-6f43-49fa-8f30-023e4cd29779')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best image with size', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getImageUrl('e766d956-6f43-49fa-8f30-023e4cd29779', 2)
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return api.getImageUrl()
      .should.be.rejectedWith('assetID must be defined');
  });
  it('should get best thumb', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getImageThumbUrl('e766d956-6f43-49fa-8f30-023e4cd29779')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best thumb assetNeue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getImageThumbUrl('notUUID')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best thumb with size', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api.getImageThumbUrl('e766d956-6f43-49fa-8f30-023e4cd29779', 2)
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return api.getImageThumbUrl()
      .should.be.rejectedWith('assetID must be defined');
  });

  it('should change email', () => {
    api.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'postEmpty');
    stub.returns(Promise.resolve());

    return api.changeEmail('someone@entrecode.de')
      .then(() => {
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined email', () => {
    return api.changeEmail().should.be.rejectedWith('email must be defined');
  });

  it('should load asset list neue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('dm-asset-list.json'));

    return api.dmAssetList('test1')
      .then((list) => {
        list.should.be.instanceof(DMAssetList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined assetGroupID', () => {
    return api.dmAssetList().should.be.rejectedWith('assetGroupID must be defined');
  });
  it('should be rejected on unknown assetGroupID', () => {
    return api.dmAssetList('unknown').should.be.rejectedWith('assetGroup not found');
  });
  it('should throw on asset list neue filtered with assetID', () => {
    return api.dmAssetList('test1', { assetID: 'id' })
      .should.be.rejectedWith('Cannot filter assetList only by assetID. Use PublicAPI#dmAsset() instead');
  });
  it('should load asset resource neue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('dm-asset-single.json'));

    return api.dmAsset('test1', 'id')
      .then((model) => {
        model.should.be.instanceof(DMAssetResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined assetID', () => {
    return api.dmAsset('test1').should.be.rejectedWith('assetID must be defined');
  });
  it('should be rejected on undefined assetGroupID', () => {
    return api.dmAsset().should.be.rejectedWith('assetGroupID must be defined');
  });

  describe('dmAssets', () => {
    it('should create dmAssets, path #1', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api.createDMAssets('test1', `${__dirname}/../mocks/test.png`)
        .then((response) => {
          response.should.be.instanceof(DMAssetList);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          throw err;
        });
    });
    it('should create dmAssets, 204', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns([]);

      return api.createDMAssets('test1', `${__dirname}/../mocks/test.png`)
        .then((response) => {
          should.equal(response, undefined);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          throw err;
        });
    });
    it('should create dmAssets, path #2', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api.createDMAssets('test1', `${__dirname}/../mocks/test.png`, { fileName: 'name' })
        .then((response) => {
          response.should.be.instanceof(DMAssetList);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          throw err;
        });
    });
    it('should create dmAssets, path array', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api.createDMAssets('test1', [`${__dirname}/../mocks/test.png`, `${__dirname}/../mocks/test.png`])
        .then((response) => {
          response.should.be.instanceof(DMAssetList);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          throw err;
        });
    });
    it('should create dmAssets, buffer, title and tags', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/test.png`, (err, file) => {
          if (err) {
            return reject(err);
          }
          return resolve(file);
        });
      })
        .then(file => api.createDMAssets('test1', [file, file], {
          fileName: ['test.png', 'test.png'],
          title: 'hello',
          tags: ['helloTag'],
        }))
        .then((response) => {
          response.should.be.instanceof(DMAssetList);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          throw err;
        });
    });
    it('should be rejected on create dmAssets with buffer and no file name #1', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api.createDMAssets('test1', [new Buffer([])])
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          stubGetUrl.restore();
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        });
    });
    it('should be rejected on create dmAssets with buffer and no file name #2', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api.createDMAssets('test1', [new Buffer([])], { fileName: 'string' })
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          stubGetUrl.restore();
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        });
    });
    it('should be rejected on create dmAssets with buffer and no file name #3', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api.createDMAssets('test1', [new Buffer([])], { fileName: [] })
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          stubGetUrl.restore();
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        });
    });
    it('should create dmAssets, FormData (mock), title and tags', () => {
      mock.reset();
      global.FormData = fdMock;
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api.createDMAssets('test1', new FormData(), { // eslint-disable-line no-undef
        title: 'hello',
        tags: ['whatwhat'],
      })
        .then((response) => {
          response.should.be.instanceof(DMAssetList);
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          global.FormData = undefined;
        })
        .catch((err) => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
          global.FormData = undefined;
          throw err;
        });
    });
    it('should be rejected on create dmAssets with undefined assetGroupID', () => {
      mock.reset();
      return api.createDMAssets().should.be.rejectedWith('assetGroupID must be defined');
    });
    it('should be rejected on create dmAssets with unknown assetGroupID', () => {
      mock.reset();
      return api.createDMAssets('asdf', 'test').should.be.rejectedWith('assetGroup not found');
    });
    it('should be rejected on create dmAssets with undefined value', () => {
      mock.reset();
      return api.createDMAssets('test1').should.be.rejectedWith('Cannot create resource with undefined object.');
    });
    it('should be rejected on create dmAssets with unsupported value', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset/beefbeef'));
      return api.createDMAssets('test1', [[]]).should.be.rejectedWith('Cannot handle input.')
        .notify(() => stubGetUrl.restore());
    });
  });
});
