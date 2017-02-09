/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const resolver = require('./mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../lib/helper');
const Accounts = require('../lib/Accounts').default;
const ListResource = require('../lib/resources/ListResource').default;
const AccountList = require('../lib/resources/AccountList').default;
const AccountResource = require('../lib/resources/AccountResource').default;
const Resource = require('../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

describe('Accounts class', () => {
  it('should instantiate', () => {
    new Accounts('live').should.be.instanceOf(Accounts);
  });
  it('should instantiate with empty environment', () => {
    new Accounts().should.be.instanceOf(Accounts);
  });
  it('should throw error on invalid environment', () => {
    const fn = () => {
      /* eslint no-new:0 */
      new Accounts('invalid');
    };
    fn.should.throw(Error);
  });
  it('should set clientID', () => {
    const accounts = new Accounts();
    accounts.should.not.have.property('clientID');
    accounts.setClientID('rest');
    accounts.should.have.property('clientID', 'rest');
  });
  it('should throw on undefined clientID', () => {
    const throws = () => new Accounts().setClientID();
    throws.should.throw(Error);
  });
  it('should throw on not rest clientID', () => {
    const throws = () => new Accounts().setClientID('notrest');
    throws.should.throw(Error);
  });
  it('should return list on list', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('account-list.json'));

    return accounts.list()
    .then((list) => {
      list.should.be.instanceof(AccountList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should return resource on get', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('account-list.json'));

    return accounts.get('aID')
    .then((resource) => {
      resource.should.be.instanceof(AccountResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on get in undefiend id', () => {
    const throws = () => new Accounts().get();
    throws.should.throw(Error);
  });
  it('should create API token', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('api-token.json'));

    return accounts.createApiToken()
    .should.eventually.have.property('accountID', '203e9c84-5c78-48ca-b266-405c9220f5d0')
    .and.notify(() => stub.restore());
  });
  it('should login successfully', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('login-token.json'));

    accounts.setClientID('rest');
    return accounts.login('andre@entrecode.de', 'mysecret').should.eventually.be.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should reject when already logged in', () => {
    const accounts = new Accounts();
    accounts.tokenStore.set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    accounts.setClientID('rest');

    return new Accounts().login('user', 'mysecret').should.be.rejectedWith(Error);
  });
  it('should be rejected on unset clientID', () => {
    const accounts = new Accounts();
    accounts.tokenStore.del();
    return accounts.login('user', 'mysecret').should.be.rejectedWith(Error);
  });
  it('should be rejected on undefined email', () => {
    const accounts = new Accounts();
    accounts.tokenStore.del();
    accounts.setClientID('rest');
    return accounts.login(null, 'mysecret').should.be.rejectedWith(Error);
  });
  it('should be rejected on undefined password', () => {
    const accounts = new Accounts();
    accounts.tokenStore.del();
    accounts.setClientID('rest');
    return accounts.setClientID('rest').login('user', null).should.be.rejectedWith(Error);
  });
  it('should logout successfully', () => {
    const accounts = new Accounts();
    accounts.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'post');
    stub.returns(Promise.resolve());

    return accounts.logout().should.be.eventually.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should be successful on no token', () => {
    const accounts = new Accounts();
    return accounts.logout().should.be.eventually.fullfilled;
  });
  it('should return true on email available', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('email-available.json'));

    return accounts.emailAvailable('someone@example.com').should.be.eventually.equal(true)
    .and.notify(() => stub.restore());
  });
  it('should be rejected on undefined email', () => {
    new Accounts().emailAvailable().should.be.rejectedWith(Error);
  });
  it('should signup new account', () => {
    const accounts = new Accounts();
    accounts.setClientID('rest');
    const url = sinon.stub(helper, 'getUrl');
    url.returns(Promise.resolve('https://accounts.entrecode.de/auth/signup?clientID=rest'));
    const token = sinon.stub(helper, 'superagentFormPost');
    token.returns(Promise.resolve({ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8' }));
    accounts.tokenStore.del();
    accounts.tokenStore.has().should.be.false;

    return accounts.signup('someone@example.com', 'suchsecurewow')
    .then((tokenResponse) => {
      tokenResponse.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
      accounts.tokenStore.has().should.be.true;
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
    new Accounts().signup(null, 'supersecure').should.be.rejectedWith(Error);
  });
  it('should be rejected on undefined password', () => {
    new Accounts().signup('someone@example.com', null).should.be.rejectedWith(Error);
  });
  it('should be rejected on undefined clientID', () => {
    new Accounts().signup('someone@example.com', 'supersecure').should.be.rejectedWith(Error);
  });
  it('should reset password', () => {
    const accounts = new Accounts();
    accounts.setClientID('rest');
    const stub = sinon.stub(helper, 'getEmpty');
    stub.returns(Promise.resolve());

    return accounts.resetPassword('someone@entrecode.de')
    .then(() => {
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined email', () => {
    new Accounts().resetPassword().should.be.rejectedWith(Error);
  });
  it('should be rejected on undefiend clientID', () => {
    new Accounts().resetPassword('someone@entrecode.de').should.be.rejectedWith(Error);
  });
  it('should change email', () => {
    const accounts = new Accounts();
    accounts.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'postEmpty');
    stub.returns(Promise.resolve());

    return accounts.changeEmail('someone@entrecode.de')
    .then(() => {
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined email', () => {
    new Accounts().changeEmail().should.be.rejectedWith(Error);
  });
  it('should be rejected on undefiend token', () => {
    const reject = () => {
      const accounts = new Accounts();
      accounts.tokenStore.del();
      return accounts.changeEmail('someone@entrecode.de');
    };
    reject().should.be.rejectedWith(Error);
  });
});

describe('Account ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/account-list.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      listJson = json;
    });
  });
  beforeEach(() => {
    list = new AccountList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of AccountList', () => {
    list.should.be.instanceOf(AccountList);
  });
  it('should have AccountResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(AccountResource));
  });
});

describe('Account Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/account-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      resourceJson = json;
    });
  });
  beforeEach(() => {
    resource = new AccountResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AccountResource', () => {
    resource.should.be.instanceOf(AccountResource);
  });
  it('should return boolean on hasPendingEmail', () => {
    resource.hasPendingEmail().should.be.false;
  });
  it('should return boolean on hasPassword', () => {
    resource.hasPassword().should.be.true;
  });
  it('should add single permission', () => {
    resource.getPermissions().should.have.property('length', 1);
    resource.addPermission('acc:something');
    resource.getPermissions().should.have.property('length', 2);
  });
  it('should throw on invalid single permission', () => {
    const throws = () => resource.addPermission();
    throws.should.throw(Error);
  });
  it('should get all permissions', () => {
    resource.getAllPermissions().should.have.property('length', 8);
  });

  const dateGetter = [
    'created',
  ];
  dateGetter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[`get${capitalizeFirstLetter(name)}`]();
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.toISOString().should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const getter = ['accountID', 'name', 'email', 'groups', 'language', 'state', 'openID', 'permissions'];
  getter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[`get${capitalizeFirstLetter(name)}`]();
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const setter = ['language', 'state', 'openID', 'permissions'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[`set${capitalizeFirstLetter(name)}`](resource.getProperty(name));
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
    it(`should throw on set${capitalizeFirstLetter(name)} with undefined value`, () => {
      const throws = () => resource[`set${capitalizeFirstLetter(name)}`]();
      throws.should.throw(Error);
    });
  });
});
