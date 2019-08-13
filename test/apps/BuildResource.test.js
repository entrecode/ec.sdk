/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const BuildResource = require('../../lib/resources/apps/BuildResource').default;
const BuildList = require('../../lib/resources/apps/BuildList').default;
const Resource = require('../../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('Build ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/build-list.json`, 'utf-8', (err, res) => {
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
    list = new BuildList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of Resource', () => {
    list.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(BuildList);
  });
  it('should have BuildResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(BuildResource));
  });
});

describe('Build Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/build-single.json`, 'utf-8', (err, res) => {
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
    resource = new BuildResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of BuildResource', () => {
    resource.should.be.instanceOf(BuildResource);
  });

  const getter = ['buildID', 'successful', 'buildLocation', 'events', 'creator'];
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

  const dateGetter = ['started', 'finished'];
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
});
