/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const traverson = require('traverson');

const helper = require('../lib/helper');
const resolver = require('./mocks/resolver');
const Resource = require('../lib/resources/Resource');
const EntryResource = require('../lib/resources/publicAPI/EntryResource');
const DataManagerResource = require('../lib/resources/datamanager/DataManagerResource').default;

const environmentSymbol = Symbol.for('environment');
const traversalSymbol = Symbol.for('traversal');
const relationsSymbol = Symbol.for('relations');

const schemaNock = require('./mocks/nock');

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
    resource = new Resource.default(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource.default);
  });
  it('should instantiate with traversal and environment', () => {
    const res = new Resource.default(resourceJson, 'stage', {});
    res[environmentSymbol].should.be.equal('stage');
    should.exist(res[traversalSymbol]);
  });
  it('should have environment live', () => {
    resource[environmentSymbol].should.be.equal('live');
  });
  it('should throw on non string environment', () => {
    const throws = () => new Resource.default(resourceJson, {});
    throws.should.throw();
  });
  it('should return traverson builder on newRequest call', () => {
    resource.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should return traverson builder on newRequest call with continue()', () => {
    resource[traversalSymbol].continue = () => resource[traversalSymbol];
    resource.newRequest().should.be.instanceOf(traverson._Builder);
  });
  it('should be clean', () => {
    resource.isDirty.should.be.false;
  });
  it('should be dirty on setProperty call', () => {
    resource.setProperty('description', 'hello');
    resource.isDirty.should.be.true;
  });
  it('should be clean on setProperty call with same value', () => {
    resource.setProperty('description', resource.getProperty('description'));
    resource.isDirty.should.be.false;
  });
  it('should restore state on reset call', () => {
    resource.setProperty('description', 'hello');
    resource.reset();
    resource.getAll().should.have.property('description', 'hier kann alles getestet werden');
  });
  it('should be clean after reset', () => {
    resource.setProperty('description', 'hello');
    resource.isDirty.should.be.true;
    resource.reset();
    resource.isDirty.should.be.false;
  });
  it('should call put on save', () => {
    schemaNock.reset();
    const stub = sinon.stub(helper, 'put');
    stub.returns(resolver('dm-single.json', resource._traversal));

    return resource
      .save()
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on safePut without modified date', () => {
    schemaNock.reset();
    return resource.save(true).should.be.eventually.rejectedWith('safe put without _modified date');
  });
  it('should have header on safePut', () => {
    schemaNock.reset();
    const stub = sinon.stub(helper, 'put');
    stub.returns(resolver('dm-single.json', resource._traversal));

    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/public-entry.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => EntryResource.createEntry(json, 'live'))
      .then((res) => res.save(true))
      .then((res) => {
        res[traversalSymbol];
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should reject on schema error', () => {
    schemaNock.reset();
    resource.setProperty('title', {});
    return resource.save().should.be.rejectedWith('Invalid format for property in JSON body');
  });
  it('should call del on del', () => {
    const stub = sinon.stub(helper, 'del');
    stub.returns(Promise.resolve({}, resource._traversal));

    return resource
      .del()
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
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
  it('should return links in getLinks', () => {
    resource.getLinks('self').should.be.deep.equal([
      {
        href: 'https://datamanager.entrecode.de/?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44',
        profile: 'https://entrecode.de/schema/datamanager',
        templated: false,
        title: 'Test DM',
      },
    ]);
  });
  it('should get object with all links', () => {
    Object.keys(resource.allLinks()).should.have.property('length', 22);
  });
  it('should call get on followLink', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-single.json'), resource._traversal);

    return resource.followLink('self').then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    });
  });
  it('should throw error on follow missing link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(Promise.reject(new Error('Traverson throws this')));

    return resource.followLink('self').should.be.rejected.and.notify(() => stub.restore());
  });
  it('should return resource on get', () => {
    const obj = resource.getAll();
    const check = ['created', 'dataManagerID', 'description', 'config', 'hexColor', 'locales', 'shortID', 'title'];
    check.forEach((property) => {
      obj.should.have.property(property, resource.getProperty(property));
    });
    Object.keys(obj).length.should.be.greaterThan(check.length);
  });
  it('should only return selected properties', () => {
    const check = ['created', 'dataManagerID', 'description', 'config', 'hexColor', 'locales', 'shortID', 'title'];
    const obj = resource.getAll(check);
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

    resource.setAll(newResource);

    const obj = resource.getAll();
    ['created', 'description', 'config', 'hexColor', 'locales', 'title'].forEach((property) => {
      obj.should.have.property(property, newResource[property]);
    });
  });
  it('should assign some values on set', () => {
    const newResource = {
      description: 'new description',
      title: 'new title',
    };

    resource.setAll(newResource);

    const obj = resource.getAll();
    ['description', 'title'].forEach((property) => {
      obj.should.have.property(property, newResource[property]);
    });
  });
  it('should throw on undefined value', () => {
    const throws = () => {
      resource.setAll();
    };
    throws.should.throw('Resource cannot be undefined.');
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

    return resource.resolve().then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    });
  });
  it('should throw on get unknown property', () => {
    resource.missing = 'yes its missing';
    return resource.save().should.be.rejectedWith('Additional properties found: missing');
  });
  it('resource called without relation', () => resource.resource().should.be.rejectedWith('relation must be defined'));
  it('resource called with non existing relation', () =>
    resource.resource('asdf').should.be.rejectedWith('unknown relation, use one of'));
  it('resourceList called without relation', () =>
    resource.resourceList().should.be.rejectedWith('relation must be defined'));
  it('resourceList called with non existing relation', () =>
    resource.resourceList('asdf').should.be.rejectedWith('unknown relation, use one of'));
  it('resourceList called with levels param', () => {
    resource[relationsSymbol] = { dummy: {} };
    return resource
      .resourceList('dummy', { _levels: 2 })
      .should.be.rejectedWith('_levels on list resources not supported');
  });
  it('create called without relation', () => resource.create().should.be.rejectedWith('relation must be defined'));
  it('create called with non existing relation', () =>
    resource.create('asdf').should.be.rejectedWith('unknown relation, use one of'));
  it('create called with relation without create options', () => {
    resource[relationsSymbol] = { dummy: {} };
    return resource.create('dummy').should.be.rejectedWith('Resource has no createRelation');
  });
  it('should validate', () => resource.validate().should.eventually.equal(true));
  it('should not validate', () => {
    schemaNock.reset();
    const dm = new DataManagerResource(resourceJson);
    dm.hexColor = 1;
    dm.locales = 'string';
    return dm.validate().should.be.rejectedWith('Invalid format for property in JSON body');
  });
});
