'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const DataManager = require('../lib/DataManager').default;
const ListResource = require('../lib/ListResource').default;
const Resource = require('../lib/Resource').default;

chai.should();
chai.use(sinonChai);

const token = fs.readFileSync(`${__dirname}/token.txt`, 'utf-8').trim();

describe('DataManager class', () => {
  it('instantiate', () => {
    new DataManager('live').should.be.instanceOf(DataManager);
  });
  it('should throw error', () => {
    const fn = () => {
      /* eslint no-new:0 */
      new DataManager();
    };
    fn.should.throw(TypeError);
  });
});

describe('DataManager ListResource', () => {
  let list;
  before((done) => {
    new DataManager('live', token).list({ size: 2 })
    .then((l) => {
      list = l;
      return done();
    })
    .catch(done);
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should have next link', () => {
    list.hasNext().should.be.true;
  });
  it('hasLink should return true', () => {
    list.hasLink('next').should.be.true;
  });
  it('hasLink should return false', () => {
    list.hasLink('doesNotExist').should.be.false;
  });
});

describe('DataManager Resource', () => {
  let datamanager;
  before((done) => {
    new DataManager('live', token).get('48e18a34-cf64-4f4a-bc47-45323a7f0e44')
    .then((dm) => {
      datamanager = dm;
      return done();
    })
    .catch(done);
  });
  it('should be instance of Resource', () => {
    datamanager.should.be.instanceOf(Resource);
  });
  it('should be clean', () => {
    datamanager.dirty().should.be.false;
  });
  it('should be dirty when setProperty was called', () => {
    datamanager.setProperty('description', 'hello');
    datamanager.dirty().should.be.true;
  });
});
