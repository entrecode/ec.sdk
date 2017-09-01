/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const GroupResource = require('../../lib/resources/accounts/GroupResource').default;
const GroupList = require('../../lib/resources/accounts/GroupList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);

describe('Group ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/group-list.json`, 'utf-8', (err, res) => {
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
    list = new GroupList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of GroupList', () => {
    list.should.be.instanceOf(GroupList);
  });
  it('should have TokenResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(GroupResource));
  });
});

describe('Group Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/group-single.json`, 'utf-8', (err, res) => {
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
    resource = new GroupResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of GroupResource', () => {
    resource.should.be.instanceOf(GroupResource);
  });
  it('should add single permission', () => {
    resource.permissions.should.have.property('length', 2);
    resource.addPermission('acc:something');
    resource.permissions.should.have.property('length', 3);
  });
  it('should throw on undefined permission', () => {
    const throws = () => resource.addPermission();
    throws.should.throw(Error);
  });
  it('should add multiple permission', () => {
    resource.permissions.should.have.property('length', 2);
    resource.addPermissions(['acc:something', 'acc:anything']);
    resource.permissions.should.have.property('length', 4);
  });
  it('should throw on undefined permissions', () => {
    const throws = () => resource.addPermissions();
    throws.should.throw(Error);
  });
  it('should throw on permissions not an array', () => {
    const throws = () => resource.addPermissions('string');
    throws.should.throw(Error);
  });

  const getter = [
    'groupID', 'name', 'permissions',
  ];
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

  const setter = ['name', 'permissions'];
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
