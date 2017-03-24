/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const resolver = require('./mocks/resolver');
const helper = require('../lib/helper');

const AssetResource = require('../lib/resources/AssetResource').default;
const AssetList = require('../lib/resources/AssetList').default;
const DeletedAssetResource = require('../lib/resources/DeletedAssetResource').default;
const DeletedAssetList = require('../lib/resources/DeletedAssetList').default;
const Resource = require('../lib/resources/Resource').default;
const ListResource = require('../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);

describe('Asset ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/asset-list.json`, 'utf-8', (err, res) => {
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
    list = new AssetList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(AssetList);
  });
  it('should have TokenResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(AssetResource));
  });

  it('should load asset list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-list.json'));

    return list.deletedAssetList()
    .then((l) => {
      l.should.be.instanceof(DeletedAssetList);
      stub.restore();
    })
    .catch(() => stub.restore());
  });
  it('should throw on asset list filtered with assetID', () => {
    return list.deletedAssetList({ assetID: 'id' })
    .should.be.rejectedWith('Cannot filter deletedAssetList only by dataManagerID and assetID. Use AssetList#deletedAsset() instead');
  });
  it('should be rejected on asset list filtered with assetID and dataManagerID', () => {
    return list.deletedAssetList({ assetID: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter deletedAssetList only by dataManagerID and assetID. Use AssetList#deletedAsset() instead');
  });
  it('should load asset resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-single.json'));

    return list.deletedAsset('id')
    .then((model) => {
      model.should.be.instanceof(DeletedAssetResource);
      stub.restore();
    })
    .catch(() => stub.restore());
  });
  it('should be rejected on undefined assetID', () => {
    return list.deletedAsset().should.be.rejectedWith('assetID must be defined');
  });
});

describe('Asset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/mocks/asset-single.json`, 'utf-8', (err, res) => {
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
    resource = new AssetResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenResource', () => {
    resource.should.be.instanceOf(AssetResource);
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

  const getter = ['assetID', 'title', 'tags', 'type', 'files'];
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

  const setter = ['title', 'tags'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });
});
