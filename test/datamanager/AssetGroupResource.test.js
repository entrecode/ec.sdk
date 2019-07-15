/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const resolver = require('./../mocks/resolver');

const helper = require('../../lib/helper');
const ListResource = require('../../lib/resources/ListResource').default;
const AssetGroupList = require('../../lib/resources/datamanager/AssetGroupList').default;
const AssetGroupResource = require('../../lib/resources/datamanager/AssetGroupResource').default;
const DMAssetList = require('../../lib/resources/publicAPI/DMAssetList').default;
const DMAssetResource = require('../../lib/resources/publicAPI/DMAssetResource').default;
const Resource = require('../../lib/resources/Resource').default;

chai.should();
chai.use(sinonChai);

describe('AssetGroup ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-asset-group-list.json`, 'utf-8', (err, res) => {
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
    list = new AssetGroupList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of AssetGroupList', () => {
    list.should.be.instanceOf(AssetGroupList);
  });
  it('should have AssetGroupResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(AssetGroupResource));
  });
});

describe('AssetGroup Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-asset-group-single.json`, 'utf-8', (err, res) => {
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
    resource = new AssetGroupResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AccountResource', () => {
    resource.should.be.instanceOf(AssetGroupResource);
  });

  const getter = ['assetGroupID', 'public', 'settings', 'policies'];
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

  const setter = ['settings', 'policies'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });

  it('should load asset list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-asset-list.json'));

    return resource
      .assetList()
      .then((list) => {
        list.should.be.instanceof(DMAssetList);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should load asset resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-asset-list.json'));

    return resource
      .asset('id')
      .then((model) => {
        model.should.be.instanceof(DMAssetResource);
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should be rejected on undefined assetID', () => {
    return resource.asset().should.be.rejectedWith('resourceID must be defined');
  });
});
