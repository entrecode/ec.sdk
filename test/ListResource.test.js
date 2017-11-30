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

const should = chai.should();
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
  it('should not instatiate on resource not a list', () => {
    const json = JSON.parse(JSON.stringify(listJson));
    delete json.total;
    delete json.count;
    const throws = () => new ListResource(json);
    throws.should.throw('Resource does not look like a ListResource. Maybe single result on filtered list?');
  });
  it('should return list of Resources on getAllItems', () => {
    const items = list.getAllItems();
    items.should.be.an('array');
    items.map(item => item.should.be.instanceOf(Resource));
  });
  it('should be stringifyable', () => {
    const parsed = JSON.parse(JSON.stringify(list));
    parsed.should.not.have.property('index');
    parsed.should.have.property('total', list.total);
    parsed.should.have.property('count', list.count);
    parsed.should.have.property('items');
    parsed.items.should.have.property('length', 2);
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
  it('should filter entries, sync iterator', function () {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.filter(dm => [
      '7e2fd960-b8ab-419f-8c8f-90da12b2a9d0',
      '768823d9-e015-4452-b8f3-6061133c5775']
    .includes(dm.getProperty('dataManagerID')))
    .then((result) => {
      result.should.be.an('array');
      result.length.should.be.equal(2);
      result[0].should.be.instanceOf(Resource);
      result[1].should.be.instanceOf(Resource);
    });
  });
  it('should filter entries, promise iterator', function () {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.filter(dm => Promise.resolve([
      '7e2fd960-b8ab-419f-8c8f-90da12b2a9d0',
      '768823d9-e015-4452-b8f3-6061133c5775']
    .includes(dm.getProperty('dataManagerID'))))
    .then((result) => {
      result.should.be.an('array');
      result.length.should.be.equal(2);
      result[0].should.be.instanceOf(Resource);
      result[1].should.be.instanceOf(Resource);
    });
  });
  it('should find entry, sync iterator', function () {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.find(dm => '58b9a1f5' === dm.getProperty('shortID'))
    .then((result) => {
      result.should.be.instanceOf(Resource);
      result.getProperty('shortID').should.be.equal('58b9a1f5');
    });
  });
  it('should find entry, promise iterator', function () {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.find(dm => Promise.resolve('aa3b242e' === dm.getProperty('shortID')))
    .then((result) => {
      result.should.be.instanceOf(Resource);
      result.getProperty('shortID').should.be.equal('aa3b242e');
    });
  });
  it('should not find entry, promise iterator', function () {
    nock('https://datamanager.entrecode.de')
    .get('/?title~=test&size=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/?title~=test&size=2&page=2')
    .replyWithFile(200, `${__dirname}/mocks/dm-list-page.json`, { 'Content-Type': 'application/json' });

    return list.find(dm => Promise.resolve('NOOOOOOOO' === dm.getProperty('shortID')))
    .then((result) => {
      should.equal(result, undefined);
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
