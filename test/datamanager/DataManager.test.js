/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

const resolver = require('./../mocks/resolver');
const fdMock = require('./../mocks/formData.mock.js');

const helper = require('../../lib/helper');
const DataManager = require('../../lib/DataManager').default;
const ListResource = require('../../lib/resources/ListResource').default;
const DataManagerList = require('../../lib/resources/datamanager/DataManagerList').default;
const DataManagerResource = require('../../lib/resources/datamanager/DataManagerResource').default;
const ModelResource = require('../../lib/resources/datamanager/ModelResource').default;
const ModelList = require('../../lib/resources/datamanager/ModelList').default;
const DMClientList = require('../../lib/resources/datamanager/DMClientList').default;
const DMClientResource = require('../../lib/resources/datamanager/DMClientResource').default;
const DMAccountList = require('../../lib/resources/datamanager/DMAccountList').default;
const DMAccountResource = require('../../lib/resources/datamanager/DMAccountResource').default;
const RoleList = require('../../lib/resources/datamanager/RoleList').default;
const RoleResource = require('../../lib/resources/datamanager/RoleResource').default;
const TemplateList = require('../../lib/resources/datamanager/TemplateList').default;
const TemplateResource = require('../../lib/resources/datamanager/TemplateResource').default;
const DMStatsList = require('../../lib/resources/datamanager/DMStatsList').default;
const DMStatsResource = require('../../lib/resources/datamanager/DMStatsResource').default;
const AssetList = require('../../lib/resources/datamanager/AssetList').default;
const AssetResource = require('../../lib/resources/datamanager/AssetResource').default;
const Resource = require('../../lib/resources/Resource').default;

const nock = require('../mocks/nock.js');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('DataManager class', () => {
  beforeEach(() => {
    nock.reset();
  });
  it('should instantiate', () => {
    new DataManager('live').should.be.instanceOf(DataManager);
  });
  it('should instantiate with empty environment', () => {
    new DataManager().should.be.instanceOf(DataManager);
  });
  it('should throw error on invalid environment', () => {
    const fn = () => {
      /* eslint no-new:0 */
      new DataManager('invalid');
    };
    fn.should.throw(Error);
  });
  it('should return list on list', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'));

    return dm.dataManagerList()
    .then((list) => {
      list.should.be.instanceof(DataManagerList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on list only with dataManagerID', () => {
    return new DataManager('live').dataManagerList({ dataManagerID: 'id' })
    .should.be.rejectedWith('Providing only an dataManagerID in DataManagerList filter will result in single resource response. Please use DataManager#get');
  });
  it('should return resource on get', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'));

    return dm.dataManager('aID')
    .then((list) => {
      list.should.be.instanceof(DataManagerResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on get with undefined id', () => {
    return new DataManager('live').dataManager()
    .should.be.rejectedWith('dataManagerID must be defined');
  });
  it('should call post on create', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((resource) => {
      const dm = new DataManager('live');
      stub.returns(Promise.resolve([resource, dm.traversal]));
      const create = Object.assign({}, {
        title: resource.title,
        description: resource.description,
        config: resource.config,
        hexColor: resource.hexColor,
        locales: resource.locales,
      });
      return dm.create(create);
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
    return new DataManager('live').create()
    .should.be.rejectedWith('Cannot create resource with undefined object');
  });

  it('should load template list', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('template-list.json'));

    return dm.templateList()
    .then((list) => {
      list.should.be.instanceof(TemplateList);
      stub.restore();
    })
    .catch((err) => { // TODO add this to all other list tests -.-
      stub.restore();
      throw err;
    });
  });
  it('should throw on template list filtered with templateID', () => {
    const dm = new DataManager('live');
    return dm.templateList({ templateID: 'id' })
    .should.be.rejectedWith('Cannot filter templateList only by templateID. Use DataManagerResource#template() instead');
  });
  it('should load template resource', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('dm-list.json'));
    stub.onSecondCall().returns(resolver('template-single.json'));

    return dm.template('id')
    .then((template) => {
      template.should.be.instanceof(TemplateResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined templateID', () => {
    const dm = new DataManager('live');
    return dm.template().should.be.rejectedWith('templateID must be defined');
  });
  it('should create template', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/template-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((templateJSON) => {
      stub.returns(Promise.resolve([templateJSON, dm.traversal]));
      const create = Object.assign({}, {
        name: templateJSON.name,
        collection: templateJSON.collection,
        dataSchema: templateJSON.dataSchema,
        version: templateJSON.version,
      });
      return dm.createTemplate(create);
    })
    .then(() => {
      stub.should.be.calledOnce;
      stub.restore();
    });
  });
  it('should be rejected on undefined template', () => {
    const dm = new DataManager('live');
    return dm.createTemplate().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load stats list', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-stats-list.json'));
    const follow = sinon.stub(dm, 'follow');
    follow.returns(Promise.resolve(dm.newRequest()));

    return dm.statsList()
    .then((list) => {
      list.should.be.instanceof(DMStatsList);
      stub.restore();
    })
    .catch((err) => { // TODO add this to all other list tests -.-
      stub.restore();
      throw err;
    });
  });
  it('should load stats resource', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('dm-list.json'));
    stub.onSecondCall().returns(resolver('dm-stats-single.json'));

    return dm.stats('id')
    .then((model) => {
      model.should.be.instanceof(DMStatsResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined dataManagerID', () => {
    const dm = new DataManager('live');
    return dm.stats().should.be.rejectedWith('dataManagerID must be defined');
  });

  it('should get best file', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('best-file.json', undefined, true));

    return dm.getFileUrl('id')
    .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
    .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return new DataManager('live').getFileUrl()
    .should.be.rejectedWith('assetID must be defined');
  });
  it('should get best image', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('best-file.json', undefined, true));

    return dm.getImageUrl('id')
    .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
    .notify(() => stub.restore());
  });
  it('should get best image with size', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('best-file.json', undefined, true));

    return dm.getImageUrl('id', 2)
    .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
    .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return new DataManager('live').getImageUrl()
    .should.be.rejectedWith('assetID must be defined');
  });
  it('should get best thumb', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('best-file.json', undefined, true));

    return dm.getImageThumbUrl('id')
    .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
    .notify(() => stub.restore());
  });
  it('should get best thumb with size', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('best-file.json', undefined, true));

    return dm.getImageThumbUrl('id', 2)
    .should.eventually.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_512.png')
    .notify(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return new DataManager('live').getImageThumbUrl()
    .should.be.rejectedWith('assetID must be defined');
  });
});

describe('DataManager ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-list.json`, 'utf-8', (err, res) => {
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
    list = new DataManagerList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of DataManagerList', () => {
    list.should.be.instanceOf(DataManagerList);
  });
  it('should have DataManagerResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(DataManagerResource));
  });
});

describe('DataManager Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-single.json`, 'utf-8', (err, res) => {
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
    resource = new DataManagerResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of DataManagerResource', () => {
    resource.should.be.instanceOf(DataManagerResource);
  });

  const dateGetter = [
    'created',
  ];
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

  const getter = [
    'dataManagerID', 'shortID',
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

  const functions = ['title', 'description', 'config', 'hexColor', 'locales'];
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

  it('should load model list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('model-list.json'));

    return resource.modelList()
    .then((model) => {
      model.should.be.instanceof(ModelList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on model list filtered with modelID', () => {
    return resource.modelList({ modelID: 'id' })
    .should.be.rejectedWith('Cannot filter modelList only by dataManagerID and modelID. Use DataManagerResource#model() instead');
  });
  it('should be rejected on model list filtered with modelID and dataManagerID', () => {
    return resource.modelList({ modelID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter modelList only by dataManagerID and modelID. Use DataManagerResource#model() instead');
  });
  it('should load model resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('model-single.json'));

    return resource.model('id')
    .then((model) => {
      model.should.be.instanceof(ModelResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined modelID', () => {
    return resource.model().should.be.rejectedWith('modelID must be defined');
  });

  it('should load client list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-client-list.json'));

    return resource.clientList()
    .then((list) => {
      list.should.be.instanceof(DMClientList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on client list filtered with clientID', () => {
    return resource.clientList({ clientID: 'id' })
    .should.be.rejectedWith('Cannot filter clientList only by dataManagerID and clientID. Use DataManagerResource#client() instead');
  });
  it('should be rejected on client list filtered with clientID and dataManagerID', () => {
    return resource.clientList({ clientID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter clientList only by dataManagerID and clientID. Use DataManagerResource#client() instead');
  });
  it('should load client resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-client-single.json'));

    return resource.client('id')
    .then((model) => {
      model.should.be.instanceof(DMClientResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined clientID', () => {
    return resource.client().should.be.rejectedWith('clientID must be defined');
  });
  it('should create client', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-client-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((clientJSON) => {
      stub.returns(Promise.resolve([clientJSON, resource.traversal]));
      const create = Object.assign({}, {
        clientID: clientJSON.clientID,
        callbackURL: clientJSON.callbackURL,
        tokenMethod: clientJSON.tokenMethod,
        disableStrategies: clientJSON.disableStrategies,
        hexColor: clientJSON.hexColor,
      });
      return resource.createClient(create);
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
    return resource.createClient().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load account list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-account-list.json'));

    return resource.accountList()
    .then((list) => {
      list.should.be.instanceof(DMAccountList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on account list filtered with accountID', () => {
    return resource.accountList({ accountID: 'id' })
    .should.be.rejectedWith('Cannot filter accountList only by dataManagerID and accountID. Use DataManagerResource#account() instead');
  });
  it('should be rejected on account list filtered with accountID and dataManagerID', () => {
    return resource.accountList({ accountID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter accountList only by dataManagerID and accountID. Use DataManagerResource#account() instead');
  });
  it('should load account resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-account-single.json'));

    return resource.account('id')
    .then((model) => {
      model.should.be.instanceof(DMAccountResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined accountID', () => {
    return resource.account().should.be.rejectedWith('accountID must be defined');
  });

  it('should load role list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('role-list.json'));

    return resource.roleList()
    .then((list) => {
      list.should.be.instanceof(RoleList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on role list filtered with roleID', () => {
    return resource.roleList({ roleID: 'id' })
    .should.be.rejectedWith('Cannot filter roleList only by dataManagerID and roleID. Use DataManagerResource#role() instead');
  });
  it('should be rejected on role list filtered with roleID and dataManagerID', () => {
    return resource.roleList({ roleID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter roleList only by dataManagerID and roleID. Use DataManagerResource#role() instead');
  });
  it('should load role resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('role-single.json'));

    return resource.role('id')
    .then((model) => {
      model.should.be.instanceof(RoleResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined roleID', () => {
    return resource.role().should.be.rejectedWith('roleID must be defined');
  });
  it('should create role', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/role-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((res) => {
      stub.returns(Promise.resolve([res, resource.traversal]));
      const create = Object.assign({}, {
        name: res.name,
        label: res.label,
        addUnregistered: res.addUnregistered,
        addRegistered: res.addRegistered,
        accounts: res.accounts,
      });
      return resource.createRole(create);
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
    return resource.createRole().should.be.rejectedWith('Cannot create resource with undefined object.');
  });

  it('should load stats resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-stats-single.json'));

    return resource.stats()
    .then((model) => {
      model.should.be.instanceof(DMStatsResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  it('should load asset list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-list.json'));

    return resource.assetList()
    .then((list) => {
      list.should.be.instanceof(AssetList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on asset list filtered with assetID', () => {
    return resource.assetList({ assetID: 'id' })
    .should.be.rejectedWith('Cannot filter assetList only by dataManagerID and assetID. Use DataManagerResource#asset() instead');
  });
  it('should be rejected on asset list filtered with assetID and dataManagerID', () => {
    return resource.assetList({ assetID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter assetList only by dataManagerID and assetID. Use DataManagerResource#asset() instead');
  });
  it('should load asset resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-single.json'));

    return resource.asset('id')
    .then((model) => {
      model.should.be.instanceof(AssetResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined assetID', () => {
    return resource.asset().should.be.rejectedWith('assetID must be defined');
  });

  it('should create asset, path', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
        },
      },
    }));
    const stubGet = sinon.stub(helper, 'get');
    stubGet.returns(resolver('asset-single.json'));

    return resource.createAsset(`${__dirname}/../mocks/test.png`)
    .then(response => response())
    .then((response) => {
      response.should.be.instanceof(AssetResource);
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      stubGet.restore();
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      stubGet.restore();
      throw err;
    });
  });
  it('should create asset, buffer, title and tags', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
        },
      },
    }));

    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/test.png`, (err, file) => {
        if (err) {
          return reject(err);
        }
        return resolve(file);
      });
    })
    .then(file => resource.createAsset(file, {
      fileName: 'test.png',
      title: 'hello',
      tags: ['helloTag'],
    }))
    .then((response) => {
      response.should.be.a('function');
      stubGetUrl.restore();
      stubSuperagentPost.restore();
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      throw err;
    });
  });
  it('should be rejected on create with buffer and no file name', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));

    return resource.createAsset(new Buffer([]))
    .then(() => {
      throw new Error('Unexpectedly resolved');
    })
    .catch((err) => {
      stubGetUrl.restore();
      if (err.message === 'Unexpectedly resolved') {
        throw err;
      }
      err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
    });
  });
  it('should create asset, FormData (mock), title and tags', () => {
    global.FormData = fdMock;
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': {
          href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
        },
      },
    }));

    return resource.createAsset(new FormData(), { //eslint-disable-line no-undef
      title: 'hello',
      tags: ['whatwhat'],
    })
    .then((response) => {
      response.should.be.a('function');
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      global.FormData = undefined;
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      global.FormData = undefined;
      throw err;
    });
  });
  it('should be rejected on create asset with undefined value', () => {
    return resource.createAsset().should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should be rejected on create asset with unsupported value', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    return resource.createAsset([]).should.be.rejectedWith('Cannot handle input.')
    .notify(() => stubGetUrl.restore());
  });

  it('should create assets, path', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
          },
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=48e18a34-cf64-4f4a-bc47-45323a7f0e44',
          },
        ],
      },
    }));
    const stubGet = sinon.stub(helper, 'get');
    stubGet.returns(resolver('asset-list.json'));

    return resource.createAssets([`${__dirname}/../mocks/test.png`, `${__dirname}/../mocks/test.png`])
    .then(response => response())
    .then((response) => {
      response.should.be.instanceof(AssetList);
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      stubGet.restore();
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      stubGet.restore();
      throw err;
    });
  });
  it('should create assets, buffer, title and tags', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
          },
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=48e18a34-cf64-4f4a-bc47-45323a7f0e44',
          },
        ],
      },
    }));

    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/test.png`, (err, file) => {
        if (err) {
          return reject(err);
        }
        return resolve(file);
      });
    })
    .then(file => resource.createAssets([file, file], {
      fileName: ['test.png', 'test.png'],
      title: 'hello',
      tags: ['helloTag'],
    }))
    .then((response) => {
      response.should.be.a('function');
      stubGetUrl.restore();
      stubSuperagentPost.restore();
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      throw err;
    });
  });
  it('should be rejected on create assets with buffer and no file name #1', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));

    return resource.createAssets([new Buffer([])])
    .then(() => {
      throw new Error('Unexpectedly resolved');
    })
    .catch((err) => {
      stubGetUrl.restore();
      if (err.message === 'Unexpectedly resolved') {
        throw err;
      }
      err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
    });
  });
  it('should be rejected on create assets with buffer and no file name #2', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));

    return resource.createAssets([new Buffer([])], { fileName: 'string' })
    .then(() => {
      throw new Error('Unexpectedly resolved');
    })
    .catch((err) => {
      stubGetUrl.restore();
      if (err.message === 'Unexpectedly resolved') {
        throw err;
      }
      err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
    });
  });
  it('should be rejected on create assets with buffer and no file name #3', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));

    return resource.createAssets([new Buffer([])], { fileName: [] })
    .then(() => {
      throw new Error('Unexpectedly resolved');
    })
    .catch((err) => {
      stubGetUrl.restore();
      if (err.message === 'Unexpectedly resolved') {
        throw err;
      }
      err.message.should.be.equal('When using buffer file input you must provide options.fileName.');
    });
  });
  it('should create assets, FormData (mock), title and tags', () => {
    global.FormData = fdMock;
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    const stubSuperagentPost = sinon.stub(helper, 'superagentPost');
    stubSuperagentPost.returns(Promise.resolve({
      _links: {
        'ec:asset': [
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=03685901-8bbe-40a2-89f2-a7c9a5db5bf8',
          },
          {
            href: 'https://datamanager.entrecode.de/asset?assetID=48e18a34-cf64-4f4a-bc47-45323a7f0e44',
          },
        ],
      },
    }));

    return resource.createAssets(new FormData(), { // eslint-disable-line no-undef
      title: 'hello',
      tags: ['whatwhat'],
    })
    .then((response) => {
      response.should.be.a('function');
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      global.FormData = undefined;
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentPost.restore();
      global.FormData = undefined;
      throw err;
    });
  });
  it('should be rejected on create assets with undefined value', () => {
    return resource.createAssets().should.be.rejectedWith('Cannot create resource with undefined object.');
  });
  it('should be rejected on create assets with unsupported value', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/asset?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44'));
    return resource.createAssets([[]]).should.be.rejectedWith('Cannot handle input.')
    .notify(() => stubGetUrl.restore());
  });

  it('should export datamanager', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-export.json'));

    return resource.export()
    .then((exported) => {
      exported.should.have.property('collection');
      exported.should.have.property('dataSchema');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
});
