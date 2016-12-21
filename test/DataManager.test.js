'use strict';

/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const sinonChai = require('sinon-chai');

const DataManager = require('../lib/Datamanager').default;
const ListResource = require('../lib/ListResource').default;
const Resource = require('../lib/Resource').default;

chai.should();
chai.use(sinonChai);

const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNjaGVyemluZ2VyQGVudHJlY29kZS5kZ' +
  'SIsImp0aSI6IjY5NDM1YzkwLTEyNzAtNDQ5OC1iMTE4LWVlNjcwM2VhYWVlNyIsImlhdCI6MTQ4MDE0NzYzOSwiZXhwIjo' +
  'xNDgyNzM5NjM5LCJpc3MiOiJlbnRyZWNvZGUiLCJzdWIiOiJkZGQyOWZkMS03NDE3LTQ4OTQtYTU0Ni01YzEyYjExYzAxO' +
  'DYifQ.EJkkbU1cb6KdjHgpFPrFYAqboRBhOsE2y4z92gD_YrrKUwjPpBXlhSFRalW1PWYW7wE6vUGI7eQDUqES1HZPgCXy' +
  '5lWLMQOTV9fZcJnTodH4i4OfNcaVFoCrz3NjNlROgwKb3efrN3-gBHt_oj_g0sE9nSFMRnd84887YziaUfMBqd1wcUXRfd' +
  '3JTx3jFBXmXvz44RaKZ-2X8WpQjF32bxWeYd69W60TWKzTaoTDFjRr8N6KsQSbB9tE7Db5Z5ZHwFtrj0SMdrl6bYIlJ_Ez' +
  '9uA4F3ROOWvw4cB5n2rDzrmYWGZ6jft6h4bHnKE7moujAQMDCRcpo43gWsY8uz7-1A';

describe('DataManager class', () => {
  it('instantiate', () => {
    new DataManager('live').should.be.instanceOf(DataManager);
  });
  it('should throw error', () => {
    const fn = () => {
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
