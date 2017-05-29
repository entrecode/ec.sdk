/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

const resolver = require('./../mocks/resolver');

const helper = require('../../lib/helper');
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const Apps = require('../../lib/Apps').default;
const AppList = require('../../lib/resources/apps/AppList').default;
const AppResource = require('../../lib/resources/apps/AppResource').default;
// const AppStatsList = require('../../lib/resources/apps/AppStatsList').defautl;
// const AppStatsResource = require('../../lib/resources/apps/AppStatsResource').default;
// const PlatformList = require('../../lib/resources/apps/PlatformList').default;
// const PlatformResource = require('../../lib/resources/apps/PlatformResource').default;

const nock = require('../mocks/nock.js');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Apps class', () => {
  beforeEach(() => {
    nock.reset();
  });
  it('should instantiate', () => {
    new Apps('live').should.be.instanceOf(Apps);
  });
  it('should instantiate with empty environment', () => {
    new Apps().should.be.instanceOf(Apps);
  });
  it('should throw error on invalid environment', () => {
    const fn = () => {
      /* eslint no-new:0 */
      new Apps('invalid');
    };
    fn.should.throw(Error);
  });
  it('should return list on list', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('app-list.json'));

    return apps.appList()
    .then((list) => {
      list.should.be.instanceof(AppList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on list only with appID', () => {
    return new Apps('live').appList({ appID: 'id' })
    .should.be.rejectedWith('Providing only an appID in AppList filter will result in single resource response. Please use Apps#app');
  });
  it('should return resource on get', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('app-list.json'));

    return apps.app('aID')
    .then((list) => {
      list.should.be.instanceof(AppResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on app with undefined id', () => {
    return new Apps('live').app()
    .should.be.rejectedWith('appID must be defined');
  });
  it('should call post on create', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((resource) => {
      const apps = new Apps('live');
      stub.returns(Promise.resolve([resource, apps.traversal]));
      const create = Object.assign({}, {
        title: resource.title,
        hexColor: resource.hexColor,
      });
      return apps.create(create);
    })
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on create with undefined', () => {
    return new Apps('live').create()
    .should.be.rejectedWith('Cannot create resource with undefined object');
  });

  it.skip('should load stats list', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('app-stats-list.json'));
    const follow = sinon.stub(apps, 'follow');
    follow.returns(Promise.resolve(apps.newRequest()));

    return apps.statsList()
    .then((list) => {
      list.should.be.instanceof(AppStatsList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it.skip('should load stats resource', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('app-list.json'));
    stub.onSecondCall().returns(resolver('app-stats-single.json'));

    return apps.stats('id')
    .then((model) => {
      model.should.be.instanceof(AppStatsResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it.skip('should be rejected on undefined appID', () => {
    const apps = new Apps('live');
    return apps.stats().should.be.rejectedWith('appID must be defined');
  });
});

describe('Apps ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-list.json`, 'utf-8', (err, res) => {
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
    list = new AppList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of AppList', () => {
    list.should.be.instanceOf(AppList);
  });
  it('should have AppResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(AppResource));
  });
});

describe('Apps Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-single.json`, 'utf-8', (err, res) => {
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
    resource = new AppResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AppResource', () => {
    resource.should.be.instanceOf(AppResource);
  });

  const dateGetter = ['created'];
  dateGetter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.toISOString().should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const getter = ['appID', 'shortID'];
  getter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const functions = ['title', 'hexColor'];
  functions.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });

  it.skip('should load platform list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('platform-list.json'));

    return resource.platformList()
    .then((list) => {
      list.should.be.instanceof(PlatformList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it.skip('should throw on platform list filtered with platformID', () => {
    return resource.platformList({ platformID: 'id' })
    .should.be.rejectedWith('Cannot filter platformList only by platformID. Use AppResource#platform() instead');
  });
  it.skip('should load platform resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('platform-single.json'));

    return resource.platform('id')
    .then((model) => {
      model.should.be.instanceof(PlatformResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it.skip('should be rejected on undefined platformID', () => {
    return resource.platform().should.be.rejectedWith('platformID must be defined');
  });
});
