/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const resolver = require('./mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const core = require('../lib/Core');
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
  it('should throw with undefiend token', () => {
    const throws = () => new Accounts().setToken();
    throws.should.throw(Error);
  });
  it('should return list on list', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(core, 'get');
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
    const stub = sinon.stub(core, 'get');
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
    const stub = sinon.stub(core, 'post');
    stub.returns(resolver('api-token.json'));

    return accounts.createApiToken()
    .should.eventually.have.property('accountID', '203e9c84-5c78-48ca-b266-405c9220f5d0')
    .notify(() => stub.restore());
  });
  it('should login successfully', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(core, 'post');
    stub.returns(resolver('login-token.json'));

    accounts.setClientID('rest');
    return accounts.login('andre@entrecode.de', 'mysecret').should.eventually.be.fulfilled
    .notify(() => stub.restore());
  });
  it('should throw on unset clientID', () => {
    const throws = () => new Accounts().login('user', 'mysecret');
    throws.should.throw(Error);
  });
  it('should throw on undefined email', () => {
    const throws = () => new Accounts().setClientID('rest').login(null, 'mysecret');
    throws.should.throw(Error);
  });
  it('should throw on undefined password', () => {
    const throws = () => new Accounts().setClientID('rest').login('user', null);
    throws.should.throw(Error);
  });
  it('should logout successfully', () => {
    const accounts = new Accounts();
    accounts.setToken('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNjaGVyemluZ2VyQGVudHJlY29kZS5kZSIsImp0aSI6IjEwODRlMGRmLTg1NzktNGRmMC1hNjc4LTk5M2QwMDNkY2QyNSIsImlhdCI6MTQ4MjUwNTcxMywiZXhwIjoxNDg1MDk3NzEzLCJpc3MiOiJlbnRyZWNvZGUiLCJzdWIiOiJkZGQyOWZkMS03NDE3LTQ4OTQtYTU0Ni01YzEyYjExYzAxODYifQ.Z2UA2EkFUMPvj5AZX5Ox5-pHiQsfw1Jjvq7sqXDT4OfdOFdGMHvKDLsJm1aVWWga5PMLSpKPucYYk_MrDTjYFp1HJhn97B1VwO62psP-Z6BMFgIPpQNB0f-_Mgth4OGucpLajoGgw9PemmHGWvyStC1Gzg9QBdKCch4VNjKvgg33puyZ5DA9YvldjUTQVhl02rHQspf4dfAz7DQHCJJN_tFhXXLpYzg_pQOu6L-yowsEFlLhl9SZoidz9v8T4PMio04g9wauilu0-ZXGRMRHKk2RYqlRaSc4QLSRZnyefdjp1_Xk7q9dG0Fn71YWxClXYlf2hycuzO2bg1-JBElxzQ');
    const stub = sinon.stub(core, 'post');
    stub.returns(Promise.resolve());

    accounts.logout().should.be.eventually.fullfilled;

    stub.restore();
  });
  it('should be successful on no token', () => {
    const accounts = new Accounts();
    accounts.logout().should.be.eventually.fullfilled;
  });
  it('should return true on email available', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(core, 'get');
    stub.returns(resolver('email-available.json'));

    accounts.emailAvailable('someone@example.com').should.be.eventually.equal(true);
    stub.restore();
  });
  it('should throw on undefined email', () => {
    const throws = () => new Accounts().emailAvailable();
    throws.should.throw(Error);
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
    resource.should.be.instanceOf(Resource);
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
