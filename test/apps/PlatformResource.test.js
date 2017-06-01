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
      spy.should.have.been.called.once;
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
    return resource.buildList({ buildID: 'id', platformID: 'id' })
    .should.be.rejectedWith('Cannot filter buildList only by buildID and platformID. Use PlatformResource#build() instead');
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
    return resource.build().should.be.rejectedWith('buildID must be defined');
  });

  it('should create new Build', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('build-single.json'));

    return resource.createBuild()
    .then(() => {
      stub.should.be.called.once;
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
    return resource.deploymentList({ deploymentID: 'id', platformID: 'id' })
    .should.be.rejectedWith('Cannot filter deploymentList only by deploymentID and platformID. Use PlatformResource#deployment() instead');
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
    return resource.deployment().should.be.rejectedWith('deploymentID must be defined');
  });

  it('should create Deployment, string - string', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('deployment-single.json'));

    return resource.createDeployment('id', 'id')
    .then(() => {
      stub.should.be.called.once;
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
      stub.should.be.called.once;
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
      stub.should.be.called.once;
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
      stub.should.be.called.once;
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
      stub.should.be.called.once;
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
      stub.should.be.called.once;
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

    return resource.codeSource()
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

    return resource.dataSource()
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

    return resource.targets()
    .then((list) => {
      list.should.be.instanceof(TargetList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  // todo getter setter plugins
});
