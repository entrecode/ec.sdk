/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const ClientResource = require('../../lib/resources/accounts/ClientResource').default;
const ClientList = require('../../lib/resources/accounts/ClientList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);

describe('Client ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/client-list.json`, 'utf-8', (err, res) => {
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
    list = new ClientList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of ClientList', () => {
    list.should.be.instanceOf(ClientList);
  });
  it('should have ClientResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(ClientResource));
  });
});

describe('Client Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/client-single.json`, 'utf-8', (err, res) => {
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
    resource = new ClientResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of ClientResource', () => {
    resource.should.be.instanceOf(ClientResource);
  });

  const getter = ['clientID', 'callbackURL', 'config'];
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

  const setter = ['callbackURL', 'config'];
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
