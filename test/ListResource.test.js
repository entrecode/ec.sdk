'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const core = require('../lib/Core');
const traverson = require('traverson');
const resolver = require('./mocks/resolver');
const Resource = require('../lib/resources/Resource').default;
const ListResource = require('../lib/resources/ListResource').default;

const should = chai.should();

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('DataManager Resource', () => {
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
    items.should.be.an.array;
    items.map(item => item.should.be.instanceOf(Resource));
  });
  it('should return single Resource on getItem', () => {
    const resource = list.getItem(1);
    resource.should.be.instanceOf(Resource);
    resource.getProperty('title').should.be.equal('ec.datamanager-sdk-tests-2');
  });
  it('should return first Resource on getFirtItem', () => {
    const resource = list.getFirstItem();
    resource.should.be.instanceOf(Resource);
    resource.getProperty('title').should.be.equal('ec.datamanager-sdk-tests-3');
  });
  it('should call put on create', () => {

  });
  it('should throw on create with undefined', () => {

  });
  it('should return true on hasFirstLink', () => {

  });
  it('should return true on hasNextLink', () => {

  });
  it('should return false on hasPrevLink', () => {

  });

});


/*
 getAllItems
 getItem
 getFirstItem
 create
 hasFirstLink
 followFirstLink
 hasNextLink
 followNextLink
 hasPrevLink
 followPrevLink
 */
