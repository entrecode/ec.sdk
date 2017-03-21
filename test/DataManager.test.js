/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const fs = require('fs');
const resolver = require('./mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../lib/helper');
const DataManager = require('../lib/DataManager').default;
const ListResource = require('../lib/resources/ListResource').default;
const DataManagerList = require('../lib/resources/DataManagerList').default;
const DataManagerResource = require('../lib/resources/DataManagerResource').default;
const ModelResource = require('../lib/resources/ModelResource').default;
const ModelList = require('../lib/resources/ModelList').default;
const DMClientList = require('../lib/resources/DMClientList').default;
const DMClientResource = require('../lib/resources/DMClientResource').default;
const DMAccountList = require('../lib/resources/DMAccountList').default;
const DMAccountResource = require('../lib/resources/DMAccountResource').default;
const RoleList = require('../lib/resources/RoleList').default;
const RoleResource = require('../lib/resources/RoleResource').default;
const TemplateList = require('../lib/resources/TemplateList').default;
const TemplateResource = require('../lib/resources/TemplateResource').default;
const DMStatsList = require('../lib/resources/DMStatsList').default;
const DMStatsResource = require('../lib/resources/DMStatsResource').default;
const Resource = require('../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('DataManager class', () => {
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
      fs.readFile(`${__dirname}/mocks/dm-single.json`, 'utf-8', (err, res) => {
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
      stub.should.be.called.once;
      stub.restore();
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
    stub.returns(resolver('template-single.json'));

    return dm.template('id')
    .then((model) => {
      model.should.be.instanceof(TemplateResource);
      stub.restore();
    })
    .catch(() => stub.restore());
  });
  it('should be rejected on undefined templateID', () => {
    const dm = new DataManager('live');
    return dm.template().should.be.rejectedWith('templateID must be defined');
  });
  it('should create template', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/template-single.json`, 'utf-8', (err, res) => {
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
      stub.should.be.called.once;
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
    stub.returns(resolver('dm-stats-single.json'));

    return dm.stats('id')
    .then((model) => {
      model.should.be.instanceof(DMStatsResource);
      stub.restore();
    })
    .catch(() => stub.restore());
  });
  it('should be rejected on undefined dataManagerID', () => {
    const dm = new DataManager('live');
    return dm.stats().should.be.rejectedWith('dataManagerID must be defined');
  });
});

describe('DataManager ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/dm-list.json`, 'utf-8', (err, res) => {
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
      fs.readFile(`${__dirname}/mocks/dm-single.json`, 'utf-8', (err, res) => {
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
      spy.should.have.been.called.once;
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
      spy.should.have.been.called.once;
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

  it('should load model list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('model-list.json'));

    return resource.modelList()
    .then((model) => {
      model.should.be.instanceof(ModelList);
      stub.restore();
    })
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
  });
  it('should be rejected on undefined clientID', () => {
    return resource.client().should.be.rejectedWith('clientID must be defined');
  });
  it('should create client', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/dm-client-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((clientJSON) => {
      stub.returns(Promise.resolve([clientJSON, resource.traversal]));
      const create = Object.assign({}, {
        clientID: resource.clientID,
        callbackURL: resource.callbackURL,
        disableStrategies: resource.disableStrategies,
        hexColor: resource.hexColor,
      });
      return resource.createClient(create);
    })
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
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
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
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
    .catch(() => stub.restore());
  });
  it('should be rejected on undefined roleID', () => {
    return resource.role().should.be.rejectedWith('roleID must be defined');
  });
  it('should create role', () => {
    const stub = sinon.stub(helper, 'post');
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/role-single.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((clientJSON) => {
      stub.returns(Promise.resolve([clientJSON, resource.traversal]));
      const create = Object.assign({}, {
        name: resource.name,
        label: resource.label,
        addUnregistered: resource.addUnregistered,
        addRegistered: resource.addRegistered,
        accounts: resource.accounts,
      });
      return resource.createRole(create);
    })
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
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
    .catch(() => stub.restore());
  });
});
