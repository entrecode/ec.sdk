/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

const helper = require('../lib/helper');
const resolver = require('./mocks/resolver');
const Resource = require('../lib/resources/Resource').default;
const ListResource = require('../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
nock.disableNetConnect();

describe('ListResource', () => {
  let listJson;
  let list;
  before((done) => {
    fs.readFile(`${__dirname}/mocks/dm-list.json`, 'utf-8', (err, res) => {
      if (err) {
        return done(err);
      }
      listJson = JSON.parse(res);
      return done();
    });
  });
  beforeEach(() => {
    list = new ListResource(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should return list of Resources on getAllItems', () => {
    const items = list.getAllItems();
    items.should.be.an('array');
    items.map(item => item.should.be.instanceOf(Resource));
  });
  it('should return empty array on getAllItems', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/dm-list-empty.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((emptyList) => {
      list = new ListResource(emptyList);
      const items = list.getAllItems();
      items.should.be.an('array');
      items.length.should.be.equal(0);
    });
  });
  it('should return single Resource on getItem', () => {
    const resource = list.getItem(1);
    resource.should.be.instanceOf(Resource);
    resource.getProperty('title').should.be.equal('ec.datamanager-sdk-tests-2');
  });
  it('should throw on getItem with undefined index', () => {
    const throws = () => list.getItem();
    throws.should.throw(Error);
  });
  it('should throw on getItem with out of bounds index', () => {
    const throws = () => list.getItem(1000);
    throws.should.throw(Error);
  });
  it('should throw on getItem with empty list', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/dm-list-empty.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((emptyList) => {
      list = new ListResource(emptyList);
      const throws = () => list.getItem(0);
      throws.should.throw(Error);
    });
  });
  it('should return first Resource on getFirtItem', () => {
    const resource = list.getFirstItem();
    resource.should.be.instanceOf(Resource);
    resource.getProperty('title').should.be.equal('ec.datamanager-sdk-tests-3');
  });
  it('should return false on hasFirstLink', () => {
    list.hasFirstLink().should.be.false;
  });
  it('should return true on hasNextLink', () => {
    list.hasNextLink().should.be.true;
  });
  it('should return false on hasPrevLink', () => {
    list.hasPrevLink().should.be.false;
  });
  it('should follow first link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'), list._traversal);

    return list.followFirstLink()
    .then((l) => {
      l.should.be.instanceOf(ListResource);
      stub.should.be.calledOnce;
      stub.restore();
    });
  });
  it('should follow next link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'), list._traversal);

    return list.followNextLink()
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    });
  });
  it('should follow prev link', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'), list._traversal);

    return list.followPrevLink()
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    });
  });

  const getter = [
    'count', 'total',
  ];
  getter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(list, 'getProperty');

      const property = list[name];
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(list.getProperty(name));

      spy.restore();
    });
  });

  it('should map over entries, sync iterator', () => {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.map(dm => dm.getProperty('dataManagerID'))
    .then((result) => {
      result.should.be.an('array');
      result.length.should.be.equal(4);
    });
  });
  it('should map over entries, promise iterator', () => {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.map(dm => Promise.resolve(dm.getProperty('dataManagerID')))
    .then((result) => {
      result.should.be.an('array');
      result.length.should.be.equal(4);
    });
  });
  it('should implement iterator, spread operator', () => {
    const array = [...list];
    array.should.have.property('length', 2);
  });
  it('should implement iterator, for of', () => {
    const array = [];

    for (const item of list) {
      array.push(item);
    }

    array.should.have.property('length', 2);
  });
});
