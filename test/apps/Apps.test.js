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
const TypesResource = require('../../lib/resources/apps/TypesResource').default;
const AppStatsList = require('../../lib/resources/apps/AppStatsList').default;
const AppStatsResource = require('../../lib/resources/apps/AppStatsResource').default;
const PlatformList = require('../../lib/resources/apps/PlatformList').default;
const PlatformResource = require('../../lib/resources/apps/PlatformResource').default;
const CodeSourceList = require('../../lib/resources/apps/CodeSourceList').default;
const CodeSourceResource = require('../../lib/resources/apps/CodeSourceResource').default;
const DataSourceList = require('../../lib/resources/apps/DataSourceList').default;
const DataSourceResource = require('../../lib/resources/apps/DataSourceResource').default;
const TargetList = require('../../lib/resources/apps/TargetList').default;
const TargetResource = require('../../lib/resources/apps/TargetResource').default;

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

    return apps
      .appList()
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
    return new Apps('live')
      .appList({ appID: 'id' })
      .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should return resource on get', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('app-list.json'));

    return apps
      .app('aID')
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
    return new Apps('live').app().should.be.rejectedWith('resourceID must be defined');
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
        const create = Object.assign(
          {},
          {
            title: resource.title,
            hexColor: resource.hexColor,
          },
        );
        return apps.createApp(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on create with undefined', () => {
    return new Apps('live').createApp().should.be.rejectedWith('Cannot create resource with undefined object');
  });

  it('should load types', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('app-list.json'));
    stub.onSecondCall().returns(resolver('app-types.json'));

    return apps
      .types()
      .then((res) => {
        res.should.be.instanceof(TypesResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });

  it('should load stats resource', () => {
    const apps = new Apps('live');
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('app-list.json'));
    stub.onSecondCall().returns(resolver('app-stats-single.json'));

    return apps
      .stats('id')
      .then((stat) => {
        stat.should.be.instanceof(AppStatsResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined appID', () => {
    const apps = new Apps('live');
    return apps.stats().should.be.rejectedWith('resourceID must be defined');
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
    }).then((json) => {
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
    list.getAllItems().forEach((item) => item.should.be.instanceOf(AppResource));
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
    }).then((json) => {
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
      spy.should.have.been.calledOnce;
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
      spy.should.have.been.calledOnce;
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
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });

  it('should load platform list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('platform-list.json'));

    return resource
      .platformList()
      .then((list) => {
        list.should.be.instanceof(PlatformList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on platform list filtered with platformID', () => {
    return resource
      .platformList({ platformID: 'id' })
      .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load platform resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('platform-single.json'));

    return resource
      .platform('id')
      .then((model) => {
        model.should.be.instanceof(PlatformResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined platformID', () => {
    return resource.platform().should.be.rejectedWith('resourceID must be defined');
  });
  it('should create platform, 1', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/platform-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            title: json.title,
            platformType: json.platformType,
            config: json.config,
            _links: json._links,
          },
        );
        return resource.createPlatform(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should create platform, 2', () => {
    const stub = sinon.stub(helper, 'post');
    return Promise.all([
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/platform-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.parse(res));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/codesource-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new CodeSourceResource(JSON.parse(res)));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/datasource-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new DataSourceResource(JSON.parse(res)));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/target-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new TargetResource(JSON.parse(res)));
        });
      }),
    ])
      .then(([json, cs, ds, t]) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            title: json.title,
            platformType: json.platformType,
            config: json.config,
            codeSource: cs,
            dataSource: ds,
            target: t,
          },
        );
        return resource.createPlatform(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should create platform, 3', () => {
    const stub = sinon.stub(helper, 'post');
    return Promise.all([
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/platform-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.parse(res));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/codesource-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new CodeSourceResource(JSON.parse(res)));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/datasource-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new DataSourceResource(JSON.parse(res)));
        });
      }),
      new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/target-single.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(new TargetResource(JSON.parse(res)));
        });
      }),
    ])
      .then(([json, cs, ds, t]) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            title: json.title,
            platformType: json.platformType,
            config: json.config,
            codeSource: cs,
            dataSource: ds,
            target: [t],
          },
        );
        return resource.createPlatform(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined platform', () => {
    return resource.createPlatform().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load codeSource list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('codesource-list.json'));

    return resource
      .codeSourceList()
      .then((list) => {
        list.should.be.instanceof(CodeSourceList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on codeSource list filtered with codeSourceID', () => {
    return resource
      .codeSourceList({ codeSourceID: 'id' })
      .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load codeSource resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('codesource-single.json'));

    return resource
      .codeSource('id')
      .then((model) => {
        model.should.be.instanceof(CodeSourceResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined codeSourceID', () => {
    return resource.codeSource().should.be.rejectedWith('resourceID must be defined');
  });
  it('should create codeSource', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/codesource-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            codeSourceType: json.codeSourceType,
            config: json.config,
          },
        );
        return resource.createCodeSource(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined client', () => {
    return resource.createCodeSource().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load dataSource list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('datasource-list.json'));

    return resource
      .dataSourceList()
      .then((list) => {
        list.should.be.instanceof(DataSourceList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on dataSource list filtered with dataSourceID', () => {
    return resource
      .dataSourceList({ dataSourceID: 'id' })
      .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load dataSource resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('datasource-single.json'));

    return resource
      .dataSource('id')
      .then((model) => {
        model.should.be.instanceof(DataSourceResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined dataSourceID', () => {
    return resource.dataSource().should.be.rejectedWith('resourceID must be defined');
  });
  it('should create dataSource', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/datasource-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            dataSourceID: json.dataSourceID,
            dataSourceType: json.dataSourceType,
            config: json.config,
          },
        );
        return resource.createDataSource(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined client', () => {
    return resource.createDataSource().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load target list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('target-list.json'));

    return resource
      .targetList()
      .then((list) => {
        list.should.be.instanceof(TargetList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should throw on target list filtered with targetID', () => {
    return resource
      .targetList({ targetID: 'id' })
      .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load target resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('target-single.json'));

    return resource
      .target('id')
      .then((model) => {
        model.should.be.instanceof(TargetResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined targetID', () => {
    return resource.target().should.be.rejectedWith('resourceID must be defined');
  });
  it('should create target', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/target-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        stub.returns(Promise.resolve([json, resource.traversal]));
        const create = Object.assign(
          {},
          {
            targetID: json.targetID,
            targetType: json.targetType,
            config: json.config,
          },
        );
        return resource.createTarget(create);
      })
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined client', () => {
    return resource.createTarget().should.be.rejectedWith('Cannot create resource with undefined object.');
  });
});
