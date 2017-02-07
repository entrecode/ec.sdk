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
const Resource = require('../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

    return dm.list()
    .then((list) => {
      list.should.be.instanceof(DataManagerList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should return resource on get', () => {
    const dm = new DataManager('live');
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-list.json'));

    return dm.get('aID')
    .then((list) => {
      list.should.be.instanceof(DataManagerResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on get with undefined id', () => {
    const throws = () => new DataManager('live').get();
    throws.should.throw(Error);
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
      stub.returns(Promise.resolve([resource, list._traversal]));
      const create = Object.assign({}, {
        title: resource.title,
        description: resource.description,
        config: resource.config,
        hexColor: resource.hexColor,
        locales: resource.locales,
      });
      return list.create(create);
    })
    .then(() => {
      stub.should.be.called.once;
      stub.restore();
    });
  });
  it('should throw on create with undefined', () => {
    const throws = () => list.create();
    throws.should.throw(Error);
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

      const property = resource[`get${capitalizeFirstLetter(name)}`]();
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.toISOString().should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  const functions = ['title', 'description', 'config', 'hexColor', 'locales'];
  functions.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[`get${capitalizeFirstLetter(name)}`]();
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[`set${capitalizeFirstLetter(name)}`](resource.getProperty(name));
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
    it(`should throw on set${capitalizeFirstLetter(name)} with undefined value`, () => {
      const throws = () => resource[`set${capitalizeFirstLetter(name)}`]();
      throws.should.throw(Error);
    });
  });
});
