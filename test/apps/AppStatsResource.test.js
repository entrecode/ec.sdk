/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const AppStatsResource = require('../../lib/resources/apps/AppStatsResource').default;
const AppStatsList = require('../../lib/resources/apps/AppStatsList').default;
const Resource = require('../../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('AppStats ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-stats-list.json`, 'utf-8', (err, res) => {
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
    list = new AppStatsList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of Resource', () => {
    list.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(AppStatsList);
  });
  it('should have AppStatsResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(AppStatsResource));
  });
});

describe('AppStats Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-stats-single.json`, 'utf-8', (err, res) => {
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
    resource = new AppStatsResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AppStatsResource', () => {
    resource.should.be.instanceOf(AppStatsResource);
  });

  const getter = [
    'appID', 'title', 'totalBuilds', 'totalBuildSize', 'monthlyBuilds', 'totalDeployments',
    'monthlyDeployments', 'usedCodeSources', 'usedDataSources', 'usedTargets', 'usedPlatforms'
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
