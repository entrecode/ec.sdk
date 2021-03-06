/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const resolver = require('./../mocks/resolver');
const helper = require('../../lib/helper');

const ListResource = require('../../lib/resources/ListResource').default;
const RoleList = require('../../lib/resources/datamanager/RoleList').default;
const RoleResource = require('../../lib/resources/datamanager/RoleResource').default;
const Resource = require('../../lib/resources/Resource').default;
const DMAccountList = require('../../lib/resources/datamanager/DMAccountList').default;

chai.should();
chai.use(sinonChai);

describe('Role ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/role-list.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    }).then((json) => {
      listJson = json;
    });
  });
  beforeEach(() => {
    list = new RoleList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of DMAccountList', () => {
    list.should.be.instanceOf(RoleList);
  });
  it('should have AccountResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(RoleResource));
  });
});

describe('Role Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/role-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    }).then((json) => {
      resourceJson = json;
    });
  });
  beforeEach(() => {
    resource = new RoleResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of RoleResource', () => {
    resource.should.be.instanceOf(RoleResource);
  });

  const getter = ['roleID', 'accountsCount', 'name', 'label', 'addUnregistered', 'addRegistered'];
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

  const setter = ['name', 'label', 'addUnregistered', 'addRegistered'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });

  it('should load account list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-account-list.json'));

    return resource
      .accountList()
      .then((list) => {
        list.should.be.instanceof(DMAccountList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
});
