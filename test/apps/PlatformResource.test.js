/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const helper = require('../../lib/helper');
const resolver = require('../mocks/resolver');

const Resource = require('../../lib/resources/Resource').default;
const PlatformList = require('../../lib/resources/apps/PlatformList').default;
const PlatformResource = require('../../lib/resources/apps/PlatformResource').default;
const TargetList = require('../../lib/resources/apps/TargetList').default;
const TargetResource = require('../../lib/resources/apps/TargetResource').default;
const CodeSourceResource = require('../../lib/resources/apps/CodeSourceResource').default;
const DataSourceResource = require('../../lib/resources/apps/DataSourceResource').default;
const BuildList = require('../../lib/resources/apps/BuildList').default;
const BuildResource = require('../../lib/resources/apps/BuildResource').default;
const DeploymentList = require('../../lib/resources/apps/DeploymentList').default;
const DeploymentResource = require('../../lib/resources/apps/DeploymentResource').default;

chai.should();
chai.use(sinonChai);

describe('Platform ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/platform-list.json`, 'utf-8', (err, res) => {
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
    list = new PlatformList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of Resource', () => {
    list.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(PlatformList);
  });
  it('should have PlatformResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(PlatformResource));
  });
});

describe('Platform Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/platform-single.json`, 'utf-8', (err, res) => {
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
    resource = new PlatformResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of PlatformResource', () => {
    resource.should.be.instanceOf(PlatformResource);
  });

  const getter = ['platformID'];
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

  const functions = ['title', 'config', 'platformType'];
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

  it('should load build list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('build-list.json'));

    return resource.buildList()
    .then((buildList) => {
      buildList.should.be.instanceof(BuildList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on buildList filtered with buildID and platformID', () => {
    return resource.buildList({ buildID: 'id' })
    .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load latest build resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('build-single.json'));

    return resource.latestBuild()
    .then((build) => {
      build.should.be.instanceof(BuildResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load build resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('build-single.json'));

    return resource.build('id')
    .then((build) => {
      build.should.be.instanceof(BuildResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined buildID', () => {
    return resource.build().should.be.rejectedWith('resourceID must be defined');
  });

  it('should create new Build', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('build-single.json'));

    return resource.createBuild()
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  it('should load deployment list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('deployment-list.json'));

    return resource.deploymentList()
    .then((deploymentList) => {
      deploymentList.should.be.instanceof(DeploymentList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on deploymentList filtered with deploymentID and platformID', () => {
    return resource.deploymentList({ deploymentID: 'id' })
    .should.be.rejectedWith('Providing only an id in ResourceList filter will result in single resource response.');
  });
  it('should load latest deployment resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('deployment-single.json'));

    return resource.latestDeployment()
    .then((deployment) => {
      deployment.should.be.instanceof(DeploymentResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load deployment resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('deployment-single.json'));

    return resource.deployment('id')
    .then((deployment) => {
      deployment.should.be.instanceof(DeploymentResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined deploymentID', () => {
    return resource.deployment().should.be.rejectedWith('resourceID must be defined');
  });

  it('should create Deployment, string - string', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.createDeployment('id', 'id')
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create Deployment, array - BuildResource', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.createDeployment(['id'], new BuildResource({ buildID: 'id' }, undefined, {}))
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create Deployment, TargetResource - string', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.createDeployment(new TargetResource({ targetID: 'id' }, undefined, {}), 'id')
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create Deployment, Array.TargetResource - string', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.createDeployment([new TargetResource({ targetID: 'id' }, undefined, {})], 'id')
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should create Deployment, TargetList - string', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    const target = new TargetList({
      count: 1,
      total: 2,
      _embedded: {
        'ec:app/target': {
          targetID: 'id',
          _links: {
            self: {
              href: 'mockedLink',
            },
          },
        },
      },
    }, undefined, {});
    return resource.createDeployment(target, 'id')
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined buildID', () => {
    resource.createDeployment('id')
    .should.be.rejectedWith('Must specify build to deploy');
  });
  it('should be rejected on undefined targetIDs', () => {
    resource.createDeployment(undefined, 'id')
    .should.be.rejectedWith('Must specify targets to deploy to');
  });

  it('should deploy latest build', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.deployLatestBuild('id')
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on platform without latest build', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/platform-single-nobuild-nodeployment.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      return new PlatformResource(json).deployLatestBuild('id')
      .should.be.rejectedWith('No latest build found');
    });
  });

  it('should load codeSource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('codesource-single.json'));

    return resource.loadCodeSource()
    .then((cs) => {
      cs.should.be.instanceof(CodeSourceResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load dataSource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('datasource-single.json'));

    return resource.loadDataSource()
    .then((ds) => {
      ds.should.be.instanceof(DataSourceResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load targets', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('target-list.json'));

    return resource.loadTargets()
    .then((list) => {
      list.should.be.instanceof(TargetList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  it('should getCodeSource id', () => {
    resource.getCodeSource().should.be.equal('2ce3f1cf-729e-4c12-b858-b7ec370b7faf');
  });
  it('should getDataSource id', () => {
    resource.getDataSource().should.be.equal('24cc9adb-cb48-4e63-8298-489830146c20');
  });
  it('should getTargets ids', () => {
    resource.getTargets().map(t => t.should.be.equal('6e704cae-70b4-4e7a-b882-befca792c5da'));
  });

  it('should setCodeSource, id', () => {
    resource.setCodeSource('00000000-0000-4444-8888-000000000000');
    resource.getCodeSource().should.be.equal('00000000-0000-4444-8888-000000000000');
  });
  it('should setCodeSource, CodeSourceResource', () => {
    resource.setCodeSource(new CodeSourceResource({
      _links: {
        self: {
          href: 'https://appserver.entrecode.de/codesource?codeSourceID=00000000-0000-4444-8888-000000000000',
        },
      },
    }));
    resource.getCodeSource().should.be.equal('00000000-0000-4444-8888-000000000000');
  });
  it('should setDataSource, id', () => {
    resource.setDataSource('00000000-0000-4444-8888-000000000000');
    resource.getDataSource().should.be.equal('00000000-0000-4444-8888-000000000000');
  });
  it('should setDataSource, DataSourceResource', () => {
    resource.setDataSource(new DataSourceResource({
      _links: {
        self: {
          href: 'https://appserver.entrecode.de/datasource?dataSourceID=00000000-0000-4444-8888-000000000000',
        },
      },
    }));
    resource.getDataSource().should.be.equal('00000000-0000-4444-8888-000000000000');
  });
  it('should setTargets, mixed', () => {
    resource.setTargets([
      '00000000-0000-4444-8888-000000000000',
      new TargetResource({
        _links: {
          self: {
            href: 'https://appserver.entrecode.de/target?targetID=00000000-0000-4444-8888-000000000000',
          },
        },
      }),
    ]);
    resource.getTargets().should.have.property('length', 2);
    resource.getTargets().map(t => t.should.be.equal('00000000-0000-4444-8888-000000000000'));
  });

  it('should addTarget, id', () => {
    resource.addTarget('00000000-0000-4444-8888-000000000000');
    resource.hasTarget('00000000-0000-4444-8888-000000000000').should.be.true;
  });
  it('should addTarget, TargetResource', () => {
    resource.addTarget(new TargetResource({
      _links: {
        self: {
          href: 'https://appserver.entrecode.de/target?targetID=00000000-0000-4444-8888-000000000000',
        },
      },
    }));
    resource.hasTarget('00000000-0000-4444-8888-000000000000').should.be.true;
  });
  it('should removeTarget, id', () => {
    resource.addTarget('00000000-0000-4444-8888-000000000000');
    resource.removeTarget('00000000-0000-4444-8888-000000000000');
    resource.hasTarget('00000000-0000-4444-8888-000000000000').should.be.false;
  });
  it('should removeTarget, TargetID', () => {
    resource.addTarget('00000000-0000-4444-8888-000000000000');
    resource.removeTarget(new TargetResource({
      targetID: '00000000-0000-4444-8888-000000000000',
    }, undefined, {}));
    resource.hasTarget('00000000-0000-4444-8888-000000000000').should.be.false;
  });
  it('should be true on hasTarget', () => {
    resource.hasTarget('6e704cae-70b4-4e7a-b882-befca792c5da').should.be.true;
  });
  it('should be false on hasTarget', () => {
    resource.hasTarget('00000000-0000-4444-8888-000000000000').should.be.false;
  });
});
