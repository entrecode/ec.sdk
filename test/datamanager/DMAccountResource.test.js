/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const LiteRoleResource = require('../../lib/resources/publicAPI/LiteRoleResource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const DMAccountList = require('../../lib/resources/datamanager/DMAccountList').default;
const DMAccountResource = require('../../lib/resources/datamanager/DMAccountResource').default;
const Resource = require('../../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('DMAccount ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-account-list.json`, 'utf-8', (err, res) => {
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
    list = new DMAccountList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of DMAccountList', () => {
    list.should.be.instanceOf(DMAccountList);
  });
  it('should have AccountResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(DMAccountResource));
  });
});

describe('DMAccount Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-account-single.json`, 'utf-8', (err, res) => {
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
    resource = new DMAccountResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AccountResource', () => {
    resource.should.be.instanceOf(DMAccountResource);
  });
  it('should return boolean on hasPassword', () => {
    resource.hasPassword.should.be.true;
  });

  const dateGetter = ['created', 'pendingUpdated'];
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

  const getter = ['accountID', 'email', 'oauth', 'pending'];
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
  it('should have title property', () => {
    const spy = sinon.spy(resource, 'getProperty');

    const property = resource.title;
    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWith('email');
    property.should.be.equal(resource.getProperty('email'));

    spy.restore();
  });
  it('should have roles property', () => {
    const roles = resource.roles;
    roles.length.should.be.gt(0);
    roles.map((role) => {
      role.should.be.instanceOf(LiteRoleResource);
    });
  });
  it('should replace roles', () => {
    const roles = resource.roles;
    roles.push(roles[0]);
    resource.roles = roles;
    resource.roles.length.should.be.equal(2);
  });
});
