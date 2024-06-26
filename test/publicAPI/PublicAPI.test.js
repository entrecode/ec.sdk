/* eslint no-unused-expressions:0 */

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

const publicSchema = require('../mocks/public-schema');
const EntryList = require('../../lib/resources/publicAPI/EntryList').default;
const EntryResource = require('../../lib/resources/publicAPI/EntryResource').default;
const DMAssetList = require('../../lib/resources/publicAPI/DMAssetList').default;
const DMAssetResource = require('../../lib/resources/publicAPI/DMAssetResource').default;
const PublicTagList = require('../../lib/resources/publicAPI/PublicTagList').default;
const PublicTagResource = require('../../lib/resources/publicAPI/PublicTagResource').default;

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
  it('should be instance of PublicAPI with UUID', () => {
    api = new Api.default('328ab31f-30a5-44d8-a65f-3e70a6dc38bb');
    api.should.be.instanceOf(Api.default);
    api.shortID.should.equal('02acf10c');
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
  it('should create instance live', () => {
    const a = new Api.default('https://datamanager.entrecode.de/api/beefbeef', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('live');
  });
  it('should create instance stage', () => {
    const a = new Api.default('https://datamanager.cachena.entrecode.de/api/beefbeef/', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('stage');
  });
  it('should create instance nightly', () => {
    const a = new Api.default('https://datamanager.buffalo.entrecode.de/api/beefbeef', null, true);
    a.shortID.should.be.equal('beefbeef');
    a[environmentSymbol].should.be.equal('nightly');
  });
  it('should create instance develop', () => {
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

  ['dataManagerID', 'title', 'description', 'locales', 'defaultLocale', 'models', 'account', 'config'].forEach(
    (property) => {
      it(`getter for ${property}`, () => {
        const stub = sinon.stub(helper, 'get');
        stub.returns(resolver('public-dm-root.json'));

        return api
          .resolve()
          .then(() => {
            api[property].should.exist;
            stub.restore();
          })
          .catch((err) => {
            stub.restore();
            throw err;
          });
      });
    },
  );

  it('should resolve data manager root response', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api
      .resolve()
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

    return api
      .resolve()
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

    return api
      .resolve()
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

    return api
      .modelList()
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

    return api
      .assetGroupList()
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
      .setToken(
        'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6bnVsbCwianRpIjoiMTZiYjVmNDUtMTc0Ny00YjQ4LWEwMTItYjhkYjBkMDE1NDVjIiwiaWF0IjoxNTIzODY2NzM2LCJleHAiOjQ2Nzc0NjY3MzYsImlzcyI6ImVjX2FkbWluIiwic3ViIjoiMzk4MWI3YzktMzNlOC00MDg0LWI4YTYtMDU2NDBjNzUwNTZmIn0.nWturDuNcjlEE99YKCWXxwyi6gV9wKrSZg4o2nfFhG4Xtb8LzdUQKtmNGTHiBIjIkeHm2dH6RO5sTGIZboiJfLePGzE8UVYmx_e5GbfCz_gq636lFHl6fUGUdD-dwGvB65L5nWsJ-eEvYEbuQz_tuK6j1aLGmnOnSPjlCqdbE_Y',
      )
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
  it('should throw on me with no account', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root-no-account.json'));

    api.setToken(
      'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6bnVsbCwianRpIjoiMTZiYjVmNDUtMTc0Ny00YjQ4LWEwMTItYjhkYjBkMDE1NDVjIiwiaWF0IjoxNTIzODY2NzM2LCJleHAiOjQ2Nzc0NjY3MzYsImlzcyI6ImVjX2FkbWluIiwic3ViIjoiMzk4MWI3YzktMzNlOC00MDg0LWI4YTYtMDU2NDBjNzUwNTZmIn0.nWturDuNcjlEE99YKCWXxwyi6gV9wKrSZg4o2nfFhG4Xtb8LzdUQKtmNGTHiBIjIkeHm2dH6RO5sTGIZboiJfLePGzE8UVYmx_e5GbfCz_gq636lFHl6fUGUdD-dwGvB65L5nWsJ-eEvYEbuQz_tuK6j1aLGmnOnSPjlCqdbE_Y',
    );

    return api
      .me()
      .then(() => {
        stub.restore();
        throw new Error('unexpectedly resolved');
      })
      .catch((err) => {
        stub.restore();
        throw err;
      })
      .should.be.rejectedWith('Outdated Access Token');
  });

  it('should set clientID', () => {
    api.setClientID('rest');
    api[tokenStoreSymbol].getClientID().should.be.equal('rest');
  });
  it('should throw on undefined clientID', () => {
    const throws = () => api.setClientID(); // eslint-disable-line new-cap
    throws.should.throw('ClientID must be defined');
  });

  it('should login successfully', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-register.json'));

    api.setClientID('rest');
    return api.login('andre@entrecode.de', 'mysecret').should.eventually.be.fulfilled.and.notify(() => stub.restore());
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
    api.setToken(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8',
    );
    const stub = sinon.stub(helper, 'post');
    stub.returns(Promise.resolve());

    return api.logout().should.be.eventually.fulfilled.and.notify(() => stub.restore());
  });
  it('should be successful on no token', () => {
    return api.logout().should.be.eventually.fulfilled;
  });
  it('should be rejected on unset clientID', () => {
    api[tokenStoreSymbol].setToken(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8',
    );
    api[tokenStoreSymbol].clientID = undefined;
    return api.logout().should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should return true on email available', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('email-available.json'));
    const follow = sinon.stub(api, 'follow');
    follow.returns(Promise.resolve(api.newRequest()));

    return api
      .emailAvailable('someone@example.com')
      .should.be.eventually.equal(true)
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
    const token = sinon.stub(helper, 'post');
    token.returns(resolver('public-register.json'));

    api[tokenStoreSymbol].deleteToken();
    api[tokenStoreSymbol].hasToken().should.be.false;

    return api
      .signup('someone@example.com', 'suchsecurewow')
      .then((tokenResponse) => {
        tokenResponse.access_token.should.be.equal(
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8',
        );
        api[tokenStoreSymbol].hasToken().should.be.true;
        token.restore();
      })
      .catch((err) => {
        token.restore();
        throw err;
      });
  });
  it('should be rejected on undefined email', () => {
    return api.signup(null, 'supersecure').should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    return api.signup('someone@example.com', null).should.be.rejectedWith('password must be defined');
  });
  it('should be rejected on undefined clientID', () => {
    api[tokenStoreSymbol].clientID = undefined;
    return api
      .signup('someone@example.com', 'supersecure')
      .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should reset password', () => {
    api.setClientID('rest');
    const stub = sinon.stub(helper, 'getEmpty');
    stub.returns(Promise.resolve());

    return api
      .resetPassword('someone@entrecode.de')
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
    return api
      .resetPassword('someone@entrecode.de')
      .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID');
  });

  it('should create anonymous', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-create-anon.json'));

    return api
      .createAnonymous()
      .should.eventually.have.property('accountID', 'b6d0671d-17f3-43b7-9eb2-e2b0e4040015')
      .and.notify(() => stub.restore());
  });
  it('should create anonymous, validUntil', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('public-create-anon.json'));

    return api
      .createAnonymous(new Date())
      .should.eventually.have.property('accountID', 'b6d0671d-17f3-43b7-9eb2-e2b0e4040015')
      .and.notify(() => stub.restore());
  });

  it('should get schema', () => {
    return api
      .getSchema('allFields')
      .should.eventually.have.property('id', 'https://datamanager.entrecode.de/api/schema/beefbeef/allFields');
  });
  it('should get schema, method set', () => {
    return api
      .getSchema('allFields', 'put')
      .should.eventually.have.property(
        'id',
        'https://datamanager.entrecode.de/api/schema/beefbeef/allFields?template=put',
      );
  });
  it('should get schema, cached', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(Promise.resolve(publicSchema));

    return api
      .getSchema('allFields')
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
    return api.getSchema('allFields', 'patch').should.be.rejectedWith('invalid method, only: get, post, and put');
  });

  it('should check permission ok', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-permissions.json'));

    return api
      .checkPermission('entry:get:read')
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

    return api
      .checkPermission('nonono')
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

    return api
      .checkPermission('entry:get:read')
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

    return api
      .checkPermission('entry:get:read')
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
    return api.checkPermission().should.be.rejectedWith('permission must be defined');
  });

  it('should resolve on entryList', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry-list.json'));

    return api
      .entryList('allFields')
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
    return api.entryList().should.be.rejectedWith('model must be defined');
  });

  it('should resolve on valueCount', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('valuecount.json'));

    return api
      .valueCount('allFields', 'entry')
      .then((values) => {
        values.should.be.an('array');
        values[0].should.have.property('count', 14478);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on valueCount no model', () => {
    return api.valueCount().should.be.rejectedWith('model must be defined');
  });
  it('should throw on valueCount no field', () => {
    return api.valueCount('mymodel').should.be.rejectedWith('field must be defined');
  });

  it('should resolve on refcount', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('refcount.json'));

    return api
      .refCount('allFields', 'entry', ['id'])
      .then((count) => {
        count.should.have.property('mlGMzYdI4Q', 2);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should resolve on refcount with chunks', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('refcount.json'));
    stub.onThirdCall().returns(resolver('refcount.json'));

    const ids = [];
    while (ids.length < 505) {
      ids.push('id');
    }

    return api
      .refCount('allFields', 'entry', ids)
      .then((count) => {
        count.should.have.property('mlGMzYdI4Q', 2);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on refcount no model', () => {
    return api.refCount().should.be.rejectedWith('model must be defined');
  });
  it('should throw on refcount no field', () => {
    return api.refCount('mymodel').should.be.rejectedWith('field must be defined');
  });
  it('should throw on refcount no ids', () => {
    return api.refCount('mymodel', 'myfield').should.be.rejectedWith('ids must be defined and an array of strings');
  });
  it('should throw on refcount ids not an array', () => {
    return api
      .refCount('mymodel', 'myfield', 'notanarray')
      .should.be.rejectedWith('ids must be defined and an array of strings');
  });
  it('should throw on refcount ids not an array of strings', () => {
    return api
      .refCount('mymodel', 'myfield', [1])
      .should.be.rejectedWith('ids must be defined and an array of strings');
  });

  it('should resolve on entry', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry.json'));

    return api
      .entry('allFields', '1234567', { _fields: ['a', 'b'] })
      .then((entry) => {
        entry.should.be.instanceof(EntryResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should resolve on entry with filter', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-entry-list.json'));

    return api
      .entry('allFields', { text: 'asdf' })
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

    return api
      .entry('allFields', '1234567', 2)
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
    return api.entry().should.be.rejectedWith('model must be defined');
  });
  it('should throw on undefined id', () => {
    return api.entry('allFields').should.be.rejectedWith('id must be defined');
  });
  it('should throw on invalid id', () => {
    return api.entry('allFields', 5).should.be.rejectedWith('invalid format for id');
  });
  it('should throw on invalid _levels', () => {
    return api.entry('allFields', '1234567', { _levels: 'string' }).should.be.rejectedWith('_levels must be integer');
  });
  it('should throw on invalid _fields', () => {
    return api.entry('allFields', '1234567', { _fields: 'string' }).should.be.rejectedWith('_fields must be an array');
  });

  it('should create entry #1', () => {
    const getStub = sinon.stub(helper, 'get');
    getStub.returns(resolver('public-dm-root.json'));
    const postStub = sinon.stub(helper, 'post');
    postStub.returns(resolver('public-entry.json'));

    return api
      .createEntry('allFields', {
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
        entries: ['1234567'],
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
  it('should create entry #2', () => {
    const getStub = sinon.stub(helper, 'get');
    getStub.returns(resolver('public-dm-root.json'));
    const postStub = sinon.stub(helper, 'post');
    postStub.returns(Promise.resolve([]));

    return api
      .createEntry('allFields', {
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
        entries: ['1234567'],
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

    return api
      .createEntry(
        'allFields',
        {
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
          entries: ['1234567'],
        },
        1,
      )
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
    return api.createEntry().should.be.rejectedWith('model must be defined');
  });
  it('should throw on undefined entry', () => {
    return api.createEntry('allFields').should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should throw on invalid entry', () => {
    return api.createEntry('allFields', {}).should.be.rejectedWith('Missing property in JSON body');
  });
  it('should throw on levels 0', () => {
    return api.createEntry('allFields', {}, 0).should.be.rejectedWith('levels must be between 1 and 5');
  });
  it('should throw on levels above 5', () => {
    return api.createEntry('allFields', {}, 6).should.be.rejectedWith('levels must be between 1 and 5');
  });

  it('should get best file assetNeue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api
      .getFileUrl('notUUID')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/beefbeef/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get error on 404', () => {
    mock.reset();
    return api
      .getFileUrl('8e2ef37e-68f8-46c7-b4ba-e9f44bc00257')
      .should.eventually.be.rejectedWith('Resource not found');
  });
  it('should be rejected on undefined assetID', () => {
    return api.getFileUrl().should.be.rejectedWith('assetID must be defined');
  });
  it('should get best image', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api
      .getImageUrl('e766d956-6f43-49fa-8f30-023e4cd29779')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/beefbeef/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best image with size', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api
      .getImageUrl('e766d956-6f43-49fa-8f30-023e4cd29779', 2)
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/beefbeef/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return api.getImageUrl().should.be.rejectedWith('assetID must be defined');
  });
  it('should get best thumb assetNeue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api
      .getImageThumbUrl('notUUID')
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/beefbeef/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should get best thumb with size', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('best-file.json'));

    return api
      .getImageThumbUrl('e766d956-6f43-49fa-8f30-023e4cd29779', 2)
      .should.eventually.be.equal('https://cdn2.entrecode.de/files/beefbeef/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
      .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return api.getImageThumbUrl().should.be.rejectedWith('assetID must be defined');
  });

  it('should change email', () => {
    api.setToken(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8',
    );
    const stub = sinon.stub(helper, 'postEmpty');
    stub.returns(Promise.resolve());

    return api
      .changeEmail('someone@entrecode.de')
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

    return api
      .dmAssetList('test1')
      .then((list) => list.should.be.instanceof(DMAssetList))
      .finally(() => stub.restore());
  });
  it('should be rejected on undefined assetGroupID', () => {
    return api.dmAssetList().should.be.rejectedWith('assetGroupID must be defined');
  });
  it('should be rejected on unknown assetGroupID', () => {
    return api.dmAssetList('unknown').should.be.rejectedWith('assetGroup not found');
  });
  it('should throw on asset list neue filtered with assetID', () => {
    return api
      .dmAssetList('test1', { assetID: 'id' })
      .should.be.rejectedWith('Cannot filter assetList only by assetID. Use PublicAPI#dmAsset() instead');
  });
  it('should load asset resource neue', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('dm-asset-single.json'));

    return api
      .dmAsset('test1', 'id')
      .then((model) => model.should.be.instanceof(DMAssetResource))
      .finally(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return api.dmAsset('test1').should.be.rejectedWith('assetID must be defined');
  });
  it('should be rejected on undefined assetGroupID', () => {
    return api.dmAsset().should.be.rejectedWith('assetGroupID must be defined');
  });

  it('should load fieldConfig - single model', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('fieldConfig.json'));

    return api
      .getFieldConfig('child')
      .then((fieldConfig) => fieldConfig.should.have.property('title'))
      .finally(() => stub.restore());
  });
  it('should load fieldConfig - multiple model', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('fieldConfig.json'));

    return api
      .getFieldConfig(['child', 'parent'])
      .then((fieldConfig) => {
        fieldConfig.should.have.property('child');
        fieldConfig.should.have.property('parent');
      })
      .finally(() => stub.restore());
  });
  it('should throw on fieldConfig without modelTitle', () => {
    return api.getFieldConfig().should.be.rejectedWith('modelTitle must be defined');
  });

  describe('dmAssets', () => {
    it('should create dmAssets, path #1', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api
        .createDMAssets('test1', `${__dirname}/../mocks/test.png`)
        .then((response) => response.should.be.instanceof(DMAssetList))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        });
    });
    it('should create dmAssets, 204', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns([]);

      return api
        .createDMAssets('test1', `${__dirname}/../mocks/test.png`)
        .then((response) => should.equal(response, undefined))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        });
    });
    it('should create dmAssets, path #2', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api
        .createDMAssets('test1', `${__dirname}/../mocks/test.png`, { fileName: 'name' })
        .then((response) => response.should.be.instanceof(DMAssetList))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        });
    });
    it('should create dmAssets, path array', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api
        .createDMAssets('test1', [`${__dirname}/../mocks/test.png`, `${__dirname}/../mocks/test.png`])
        .then((response) => response.should.be.instanceof(DMAssetList))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
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
        .then((file) =>
          api.createDMAssets('test1', [file, file], {
            fileName: ['test.png', 'test.png'],
            title: 'hello',
            tags: ['helloTag'],
          }),
        )
        .then((response) => response.should.be.instanceof(DMAssetList))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
        });
    });
    it('should be rejected on create dmAssets with buffer and no file name #1', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api
        .createDMAssets('test1', [Buffer.alloc(1)])
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        })
        .finally(() => stubGetUrl.restore());
    });
    it('should be rejected on create dmAssets with buffer and no file name #2', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api
        .createDMAssets('test1', [Buffer.alloc(1)], { fileName: 'string' })
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        })
        .finally(() => stubGetUrl.restore());
    });
    it('should be rejected on create dmAssets with buffer and no file name #3', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));

      return api
        .createDMAssets('test1', [Buffer.alloc(1)], { fileName: [] })
        .then(() => {
          throw new Error('Unexpectedly resolved');
        })
        .catch((err) => {
          if (err.message === 'Unexpectedly resolved') {
            throw err;
          }
          err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
        })
        .finally(() => stubGetUrl.restore());
    });
    it('should create dmAssets, FormData, title and tags', () => {
      mock.reset();
      const stubGetUrl = sinon.stub(helper, 'getUrl');
      stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/a/beefbeef/test1'));
      const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
      stubSuperagentPost.returns(resolver('dm-asset-create.json', null, true));

      return api
        .createDMAssets('test1', new FormData(), {
          // eslint-disable-line no-undef
          title: 'hello',
          tags: ['whatwhat'],
        })
        .then((response) => response.should.be.instanceof(DMAssetList))
        .finally(() => {
          stubGetUrl.restore();
          stubSuperagentPost.restore();
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
      return api
        .createDMAssets('test1', [[]])
        .should.be.rejectedWith('Cannot handle input.')
        .notify(() => stubGetUrl.restore());
    });
  });

  describe('auth api', () => {
    it('should be rejected on configurableSignup no body', () => {
      return api.configurableSignup().should.be.rejectedWith('body must be defined');
    });
    it('should be rejected on configurableSignup no email', () => {
      return api.configurableSignup({}).should.be.rejectedWith('email must be defined in body');
    });
    it('should call configurableSignup', () => {
      const stub = sinon.stub(helper, 'post');
      stub.returns(resolver('configurable-signup.json'));

      return api
        .configurableSignup({ email: 'andre@entrecode.de' })
        .then((res) => {
          res.should.have.property('email', 'andre@entrecode.de');
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });

    it('should be rejected on configurableSignupEdit no body', () => {
      return api.configurableSignupEdit().should.be.rejectedWith('body must be defined');
    });
    it('should be rejected on configurableSignupEdit no validationToken', () => {
      return api.configurableSignupEdit({}).should.be.rejectedWith('validationToken must be defined in body');
    });
    it('should be rejected on configurableSignupEdit no clientID', () => {
      return api
        .configurableSignupEdit({ validationToken: 'asdf' })
        .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID(clientID: string) or sent in body');
    });
    it('should call configurableSignupEdit', () => {
      const stub = sinon.stub(helper, 'put');
      stub.returns(resolver('configurable-signup-edit.json'));

      api.setClientID('rest');

      return api
        .configurableSignupEdit({
          validationToken: 'asdf',
          pending: false,
        })
        .then((res) => {
          res.token.should.be.equal('accessToken');
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });

    it('should be rejected on getValidationToken no email', () => {
      return api.getValidationToken().should.be.rejectedWith('email must be defined');
    });
    it('should be rejected on getValidationToken illegal type', () => {
      return api
        .getValidationToken('andre@entrecode.de', 'not_allowed')
        .should.be.rejectedWith('validation token type invalid, must match /^[a-zA-Z0-9]{1,64}$/');
    });
    it('should call getValidationToken', () => {
      const stub = sinon.stub(helper, 'get');
      stub.onFirstCall().returns(resolver('public-dm-root.json'));
      stub.onSecondCall().returns(resolver('get-validation-token.json'));

      return api
        .getValidationToken({
          email: 'andre@entrecode.de',
        })
        .then((res) => {
          res.should.be.equal('validationToken');
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });

    it('should be rejected on validateValidationToken no validationToken', () => {
      return api.validateValidationToken().should.be.rejectedWith('validationToken must be defined');
    });
    it('should be rejected on getValidationToken illegal type', () => {
      return api
        .validateValidationToken('validatioNToken', 'not_allowed')
        .should.be.rejectedWith('validation token type invalid, must match /^[a-zA-Z0-9]{1,64}$/');
    });
    it('should call validateValidationToken', () => {
      const stub = sinon.stub(helper, 'get');
      stub.onFirstCall().returns(resolver('public-dm-root.json'));
      stub.onSecondCall().returns(resolver('validate-validation-token.json'));

      return api
        .validateValidationToken('validationToken')
        .then((res) => {
          res.should.have.property('email', 'andre@entrecode.de');
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });

    it('should be rejected on loginWithToken no body', () => {
      return api.loginWithToken().should.be.rejectedWith('body must be defined');
    });
    it('should be rejected on loginWithToken no validationToken', () => {
      return api.loginWithToken({}).should.be.rejectedWith('validationToken must be defined in body');
    });
    it('should be rejected on loginWithToken with no clientID', () => {
      return api
        .loginWithToken({ validationToken: 'validationToken' })
        .should.be.rejectedWith('clientID must be set with PublicAPI#setClientID(clientID: string) or sent in body');
    });
    it('should call loginWithToken', () => {
      const stub = sinon.stub(helper, 'post');
      stub.returns(resolver('email-login-token.json'));
      const getStub = sinon.stub(helper, 'get');
      getStub.returns(resolver('public-dm-root.json'));

      api.setClientID('rest');

      return api
        .loginWithToken({ validationToken: 'validationToken' })
        .then((res) => {
          res.access_token.should.be.equal(
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8',
          );
          stub.restore();
          getStub.restore();
        })
        .catch((err) => {
          stub.restore();
          getStub.restore();
          throw err;
        });
    });
  });

  describe('tags', () => {
    it('should load tag list', () => {
      const stub = sinon.stub(helper, 'get');
      stub.onFirstCall().returns(resolver('public-dm-root.json'));
      stub.onSecondCall().returns(resolver('public-tag-list.json'));

      return api
        .tagList()
        .then((l) => {
          l.should.be.instanceof(PublicTagList);
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });
    it('should throw on tag list filtered with tag', () => {
      return api
        .tagList({ tag: 'id' })
        .should.be.rejectedWith('Cannot filter tagList only by tag. Use PublicAPI#tag() instead');
    });
    it('should load tag resource', () => {
      const stub = sinon.stub(helper, 'get');
      stub.onFirstCall().returns(resolver('public-dm-root.json'));
      stub.onSecondCall().returns(resolver('asset-single.json'));

      return api
        .tag('id')
        .then((model) => {
          model.should.be.instanceof(PublicTagResource);
          stub.restore();
        })
        .catch((err) => {
          stub.restore();
          throw err;
        });
    });
    it('should be rejected on undefined tag', () => {
      return api.tag().should.be.rejectedWith('tag must be defined');
    });
  });

  describe('refreshToken', () => {
    it('should check refresh token', async () => {
      api.setToken(
        'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNjaGVyemluZ2VyK2RlYWxAZW50cmVjb2RlLmRlIiwianRpIjoiNWYwNWVjMDktYTNkMC00YTM1LTk3YTYtZmQ2NTEwMzFkMWE0IiwiaWF0IjoxNTU0ODc5MjY4LCJleHAiOjE1NTc0NzEyNjgsImlzcyI6ImRlYWxidW5ueV9kZXYiLCJzdWIiOiJjN2ExYzc0NS03Zjg3LTRhNjItYmM1Ni04ZWIwM2Y2M2ZhMDYifQ.VdxqAuQf1M0pO7bN8d3bEtgKqYfgTEwfK78xdt397UJR3STwj3GF9zryCCCRwzXYR2VZApfOJPELQPwQCcfpSJo_cgyLXKK3v1sz0dP8WxMpUGy7kfVZDxh-ofzir87MH_VCm4bskb07xjUWzJCy_dO7hgsH9NmesP1w8PLEnNg',
      );
      api.setRefreshToken(
        'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhN2ZlYzdhZC0xMWVmLTQzNjktODY1My1kY2Q3ZmFiNTNmODEiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTU1NDg3OTI2OCwiaXNzIjoiZGVhbGJ1bm55X2RldiIsInN1YiI6ImM3YTFjNzQ1LTdmODctNGE2Mi1iYzU2LThlYjAzZjYzZmEwNiJ9.Aw7HC6YtWVd6d7rGBApxSSswHlH_XbVnfydwd8NpDk2oGJUXG53kHWKl79t-7fDLBw92jgRiHHKkhSWmRdEKjY7sspregHgNWCWT77kWf8_uJBgIiNpRxhfr-GBo-yhDStmgnj8FRtB9v1Uy7NMFRYYw1_6RodCXOHqRr1PuVko',
      );
      const shouldRefresh = await api.timeToRefresh();
      shouldRefresh.should.be.true;
    });
  });
});
