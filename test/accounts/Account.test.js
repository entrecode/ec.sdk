/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const resolver = require('./../mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../../lib/helper');
const Accounts = require('../../lib/Accounts').default;
const ListResource = require('../../lib/resources/ListResource').default;
const AccountList = require('../../lib/resources/accounts/AccountList').default;
const AccountResource = require('../../lib/resources/accounts/AccountResource').default;
const ClientList = require('../../lib/resources/accounts/ClientList').default;
const ClientResource = require('../../lib/resources/accounts/ClientResource').default;
const GroupList = require('../../lib/resources/accounts/GroupList').default;
const GroupResource = require('../../lib/resources/accounts/GroupResource').default;
const InvitesResource = require('../../lib/resources/accounts/InvitesResource').default;
const InvalidPermissionsResource = require('../../lib/resources/accounts/InvalidPermissionsResource').default;
const Resource = require('../../lib/resources/Resource').default;
const tokenStoreSymbol = require('../../lib/Core').tokenStoreSymbol;

const nock = require('../mocks/nock.js');

chai.should();
chai.use(sinonChai);

describe('Accounts class', () => {
  beforeEach(() => {
    nock.reset();
  });
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
    accounts[tokenStoreSymbol].getClientID().should.be.equal('rest');
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

    return accounts.accountList()
    .then((list) => {
      list.should.be.instanceof(AccountList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on list only with accountID', () => {
    return new Accounts().accountList({ accountID: 'id' })
    .should.be.rejectedWith('Providing only an accountID in AccountList filter will result in single resource response. Please use Accounts#account');
  });
  it('should return resource on get', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('account-list.json'));

    return accounts.account('aID')
    .then((resource) => {
      resource.should.be.instanceof(AccountResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on get in undefiend id', () => {
    return new Accounts().account().should.be.rejectedWith('accountID must be defined');
  });
  it('should return resource on me', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('account-list.json'));
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.me()
    .then((resource) => {
      resource.should.be.instanceof(AccountResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create API token', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('api-token.json'));

    return accounts.createApiToken()
    .should.eventually.have.property('accountID', '203e9c84-5c78-48ca-b266-405c9220f5d0')
    .and.notify(() => stub.restore());
  });
  it('should return true on email available', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('email-available.json'));
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.emailAvailable('someone@example.com').should.be.eventually.equal(true)
    .and.notify(() => stub.restore());
  });
  it('should be rejected on undefined email', () => {
    return new Accounts().emailAvailable().should.be.rejectedWith('email must be defined');
  });
  it('should signup new account', () => {
    const accounts = new Accounts();
    accounts.setClientID('rest');
    const url = sinon.stub(helper, 'getUrl');
    url.returns(Promise.resolve('https://accounts.entrecode.de/auth/signup?clientID=rest'));
    const token = sinon.stub(helper, 'superagentFormPost');
    token.returns(Promise.resolve({ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8' }));
    accounts[tokenStoreSymbol].del();
    accounts[tokenStoreSymbol].has().should.be.false;

    return accounts.signup('someone@example.com', 'suchsecurewow')
    .then((tokenResponse) => {
      tokenResponse.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
      accounts[tokenStoreSymbol].has().should.be.true;
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
    return new Accounts().signup(null, 'supersecure')
    .should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    return new Accounts().signup('someone@example.com', null)
    .should.be.rejectedWith('password must be defined');
  });
  it('should be rejected on undefined clientID', () => {
    const accounts = new Accounts();
    accounts[tokenStoreSymbol].clientID = undefined;
    return accounts.signup('someone@example.com', 'supersecure')
    .should.be.rejectedWith('clientID must be set with Account#setClientID');
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
    return new Accounts().resetPassword().should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefiend clientID', () => {
    const accounts = new Accounts();
    accounts[tokenStoreSymbol].clientID = undefined;
    return new Accounts().resetPassword('someone@entrecode.de')
    .should.be.rejectedWith('clientID must be set with Account#setClientID');
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
    return new Accounts().changeEmail().should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefiend token', () => {
    const reject = () => {
      const accounts = new Accounts();
      accounts[tokenStoreSymbol].del();
      return accounts.changeEmail('someone@entrecode.de');
    };
    return reject().should.be.rejectedWith('not logged in');
  });
  it('should create invites', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('invites.json'), accounts.traversal);

    return accounts.createInvites(5)
    .then((invites) => {
      invites.should.be.instanceOf(InvitesResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create invite', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('invites.json'), accounts.traversal);

    return accounts.createInvites()
    .then((invites) => {
      invites.should.be.instanceOf(InvitesResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected in count not a number', () => {
    return new Accounts().createInvites('notANumber')
    .should.be.rejectedWith('count must be a number');
  });
  it('should load invites', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('invites.json'), accounts.traversal);
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.invites()
    .then((invites) => {
      invites.should.be.instanceOf(InvitesResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should return list on clientList', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('client-list.json'));

    return accounts.clientList()
    .then((list) => {
      list.should.be.instanceof(ClientList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on clientList only with clientID', () => {
    return new Accounts().clientList({ clientID: 'id' })
    .should.be.rejectedWith('Providing only an clientID in ClientList filter will result in single resource response. Please use Accounts#client');
  });
  it('should return resource on client', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('account-list.json'));
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.client('aID')
    .then((resource) => {
      resource.should.be.instanceof(ClientResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on client with undefiend id', () => {
    return new Accounts().client().should.be.rejectedWith('clientID must be defined');
  });
  it('should call post on create client', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/client-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((resource) => {
      const acc = new Accounts('live');
      stub.returns(Promise.resolve([resource, acc.traversal]));
      const create = Object.assign({}, {
        clientID: resource.clientID,
        callbackURL: resource.callbackURL,
        config: resource.config,
      });
      return acc.createClient(create);
    })
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on create with undefined', () => {
    return new Accounts('live').createClient()
    .should.be.rejectedWith('Cannot create resource with undefined object');
  });
  it('should return invalidPermissionsResource', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('invalid-permissions.json'));
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.invalidPermissions()
    .then((resource) => {
      resource.should.be.instanceof(InvalidPermissionsResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should return list on clientList', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('group-list.json'));

    return accounts.groupList()
    .then((list) => {
      list.should.be.instanceof(GroupList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on clientList only with clientID', () => {
    return new Accounts().groupList({ groupID: 'id' })
    .should.be.rejectedWith('Providing only an groupID in GroupList filter will result in single resource response. Please use Accounts#groupList');
  });
  it('should return resource on group', () => {
    const accounts = new Accounts('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('group-list.json'));
    const follow = sinon.stub(accounts, 'follow');
    follow.returns(Promise.resolve(accounts.newRequest()));

    return accounts.group('aID')
    .then((resource) => {
      resource.should.be.instanceof(GroupResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on group with undefiend id', () => {
    return new Accounts().group().should.be.rejectedWith('groupID must be defined');
  });
  it('should call post on create group', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/group-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((resource) => {
      const acc = new Accounts('live');
      stub.returns(Promise.resolve([resource, acc.traversal]));
      const create = Object.assign({}, {
        name: resource.name,
        permissions: resource.permissions,
      });
      return acc.createGroup(create);
    })
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on create with undefined', () => {
    return new Accounts('live').createGroup()
    .should.be.rejectedWith('Cannot create resource with undefined object');
  });
});

describe('Account ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/account-list.json`, 'utf-8', (err, res) => {
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
      fs.readFile(`${__dirname}/../mocks/account-single.json`, 'utf-8', (err, res) => {
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
    resource.hasPendingEmail.should.be.false;
  });
  it('should return boolean on hasPassword', () => {
    resource.hasPassword.should.be.true;
  });
  it('should add single permission', () => {
    resource.permissions.should.have.property('length', 1);
    resource.addPermission('acc:something');
    resource.permissions.should.have.property('length', 2);
  });
  it('should throw on invalid single permission', () => {
    const throws = () => resource.addPermission();
    throws.should.throw(Error);
  });
  it('should get all permissions', () => {
    resource.getAllPermissions().should.have.property('length', 8);
  });
  it('should check permission ok', () => {
    return resource.checkPermission('dm-stats').should.be.true;
  });
  it('should check permission not ok', () => {
    return resource.checkPermission('nonono').should.be.false;
  });
  it('should throw on permission check with no permission', () => {
    const throws = () => resource.checkPermission();
    throws.should.throw('permission must be defined');
  });
  it('should load TokenList', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('token-list.json'));

    return resource.tokenList().should.be.fulfilled
    .and.notify(() => stub.restore());
  });

  const dateGetter = [
    'created',
  ];
  dateGetter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name);
      property.toISOString().should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const getter = ['accountID', 'name', 'email', 'groups', 'language', 'state', 'openID', 'permissions'];
  getter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const setter = ['name', 'language', 'state', 'openID', 'permissions'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });
});
