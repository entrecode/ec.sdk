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
});
