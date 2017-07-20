/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const DMStatsResource = require('../../lib/resources/datamanager/DMStatsResource').default;
const DMStatsList = require('../../lib/resources/datamanager/DMStatsList').default;
const Resource = require('../../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('DMStats ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-stats-list.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      listJson = json;
    });
  });
  beforeEach(() => {
    list = new DMStatsList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of Resource', () => {
    list.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(DMStatsList);
  });
  it('should have DMStatsResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(DMStatsResource));
  });
  it('should get n\'th item', () => {
    list.getItem(0).should.be.instanceOf(DMStatsResource);
  });
  it('should throw on undefined n', () => {
    const throws = () => list.getItem();
    throws.should.throw('Index must be defined.');
  });
  it('should throw on empty list', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-stats-list-empty.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(res));
      });
    })
    .then((listJsonEmpty) => {
      const emptyList = new DMStatsList(listJsonEmpty);
      const throws = () => emptyList.getItem(0);
      return throws.should.throw('Cannot get n\'th item of empty list.');
    });
  });
  it('should get first item', () => {
    list.getFirstItem().should.be.instanceOf(DMStatsResource);
  });
});

describe('DMStats Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-stats-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      resourceJson = json;
    });
  });
  beforeEach(() => {
    resource = new DMStatsResource(resourceJson.dataManagers[0]);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of DMStatsResource', () => {
    resource.should.be.instanceOf(DMStatsResource);
  });

  const getter = [
    'dataManagerID', 'title', 'config', 'templateID', 'templateName', 'templateVersion',
    'modelCount', 'entryCount', 'assetCount', 'fileCount', 'fileSize', 'numberAccounts',
    'numberRequests', 'numberHookRequests', 'monthlyRequests', 'monthlyHooks',
  ];
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
});
