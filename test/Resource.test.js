/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../lib/helper');
const traverson = require('traverson');
const resolver = require('./mocks/resolver');
const Resource = require('../lib/resources/Resource').default;

const should = chai.should();

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Resource', () => {
  let resourceJson;
  let resource;
  before((done) => {
    fs.readFile(`${__dirname}/mocks/dm-single.json`, 'utf-8', (err, res) => {
      if (err) {
        return done(err);
      }
      resourceJson = JSON.parse(res);
      return done();
    });
  });
  beforeEach(() => {
    resource = new Resource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should instantiate with traversal and environment', () => {
    const res = new Resource(resourceJson, 'stage', {});
    res.environment.should.be.equal('stage');
    should.exist(res.traversal);
  });
  it('should have environment live', () => {
    resource.environment.should.be.equal('live');
  });
  it('should throw on non string environment', () => {
    const throws = () => new Resource(resourceJson, {});
    throws.should.throw();
  });
  it('should return traverson builder on newRequest call', () => {
    resource.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should be clean', () => {
    resource.isDirty.should.be.false;
  });
  it('should be dirty on setProperty call', () => {
    resource.setProperty('description', 'hello');
    resource.isDirty.should.be.true;
  });
  it('should restore state on reset call', () => {
    resource.setProperty('description', 'hello');
    resource.reset();
    resource.get().should.have.property('description', 'hier kann alles getestet werden');
  });
  it('should be clean after reset', () => {
    resource.setProperty('description', 'hello');
    resource.isDirty.should.be.true;
    resource.reset();
    resource.isDirty.should.be.false;
  });
  it('should call put on save', () => {
    const stub = sinon.stub(helper, 'put');
    stub.returns(resolver('dm-single.json', resource._traversal));

    return resource.save()
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    });
  });
  it('should call del on del', () => {
    const stub = sinon.stub(helper, 'del');
    stub.returns(Promise.resolve({}, resource._traversal));

    return resource.del()
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    });
  });
  it('should return true for existing link', () => {
    resource.hasLink('self').should.be.true;
  });
  it('should return false for missing link', () => {
    resource.hasLink('missing').should.be.false;
  });
  it('should return link in getLink', () => {
    resource.getLink('self').should.be.deep.equal({
      href: 'https://datamanager.entrecode.de/?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44',
      profile: 'https://entrecode.de/schema/datamanager',
      templated: false,
      title: 'Test DM',
    });
  });
  it('should return undefined in getLink', () => {
    should.not.exist(resource.getLink('missing'));
  });
  it('should call get on followLink', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-single.json'), resource._traversal);

    return resource.followLink('self')
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    });
  });
  it('should throw error on follow missing link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(Promise.reject(new Error('Traverson throws this')));

    return resource.followLink('self').should.be.rejected
    .and.notify(() => stub.restore());
  });
  it('should return resource on get', () => {
    const obj = resource.get();
    const check = ['created', 'dataManagerID', 'description', 'config', 'hexColor', 'locales', 'shortID', 'title'];
    check.forEach((property) => {
      obj.should.have.property(property, resource.getProperty(property));
    });
    Object.keys(obj).length.should.be.greaterThan(check.length);
  });
  it('should only return selected properties', () => {
    const check = ['created', 'dataManagerID', 'description', 'config', 'hexColor', 'locales', 'shortID', 'title'];
    const obj = resource.get(check);
    check.forEach((property) => {
      obj.should.have.property(property, resource.getProperty(property));
    });
    Object.keys(obj).length.should.be.equal(check.length);
  });
  it('should assign all values on set', () => {
    const newResource = {
      created: new Date().toISOString(),
      description: 'new description',
      config: {},
      hexColor: '#ffffff',
      locales: ['de'],
      title: 'new title',
    };

    resource.set(newResource);

    const obj = resource.get();
    ['created', 'description', 'config', 'hexColor', 'locales', 'title']
    .forEach((property) => {
      obj.should.have.property(property, newResource[property]);
    });
  });
  it('should assign some values on set', () => {
    const newResource = {
      description: 'new description',
      title: 'new title',
    };

    resource.set(newResource);

    const obj = resource.get();
    ['description', 'title']
    .forEach((property) => {
      obj.should.have.property(property, newResource[property]);
    });
  });
  it('should throw on undefined value', () => {
    const throws = () => {
      resource.set();
    };
    throws.should.throw(Error);
  });
  it('should return single property', () => {
    resource.getProperty('title').should.be.equal('Test DM');
  });
  it('should throw on undefined property name', () => {
    const throws = () => {
      resource.getProperty();
    };
    throws.should.throw(Error);
  });
  it('should return undefined on missing property', () => {
    should.not.exist(resource.getProperty('missing'));
  });
  it('should set single property', () => {
    resource.setProperty('title', 'New Title');
    resource.getProperty('title').should.be.equal('New Title');
  });
  it('should call get on resolve', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-single.json', resource._traversal));

    return resource.resolve()
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    });
  });
});
