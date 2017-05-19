/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const resolver = require('./../mocks/resolver');
const helper = require('../../lib/helper');

const AssetResource = require('../../lib/resources/datamanager/AssetResource').default;
const AssetList = require('../../lib/resources/datamanager/AssetList').default;
const DeletedAssetResource = require('../../lib/resources/datamanager/DeletedAssetResource').default;
const DeletedAssetList = require('../../lib/resources/datamanager/DeletedAssetList').default;
const TagResource = require('../../lib/resources/datamanager/TagResource').default;
const TagList = require('../../lib/resources/datamanager/TagList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);

describe('Asset ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-list.json`, 'utf-8', (err, res) => {
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
    .catch((err) => {
      stub.restore();
      throw err;
    });
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
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined assetID', () => {
    return list.deletedAsset().should.be.rejectedWith('assetID must be defined');
  });

  it('should load tag list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('tag-list.json'));

    return list.tagList()
    .then((l) => {
      l.should.be.instanceof(TagList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on tag list filtered with tag', () => {
    return list.tagList({ tag: 'id' })
    .should.be.rejectedWith('Cannot filter tagList only by dataManagerID and tag. Use AssetList#tag() instead');
  });
  it('should be rejected on tag list filtered with tag and dataManagerID', () => {
    return list.tagList({ tag: 'id', dataManagerID: 'id' })
    .should.be.rejectedWith('Cannot filter tagList only by dataManagerID and tag. Use AssetList#tag() instead');
  });
  it('should load tag resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-single.json'));

    return list.tag('id')
    .then((model) => {
      model.should.be.instanceof(TagResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on undefined tag', () => {
    return list.tag().should.be.rejectedWith('tag must be defined');
  });

  it('should resolve on download without writable stream', () => {
    const stub = sinon.stub(helper, 'getUrl');
    stub.returns(Promise.resolve('https://datamanager.entrecode.de/assets/download'));

    return list.download()
    .then(() => stub.restore())
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve on download with writable stream', () => {
    const stubGetUrl = sinon.stub(helper, 'getUrl');
    stubGetUrl.returns(Promise.resolve('https://datamanager.entrecode.de/assets/download'));
    const stubSuperagentGetPiped = sinon.stub(helper, 'superagentGetPiped');
    stubSuperagentGetPiped.returns(Promise.resolve());

    return list.download(fs.createWriteStream('/dev/null'))
    .then(() => {
      stubGetUrl.restore();
      stubSuperagentGetPiped.restore();
    })
    .catch((err) => {
      stubGetUrl.restore();
      stubSuperagentGetPiped.restore();
      throw err;
    });
  });
  it('should be rejected on stream not writable', () => {
    return list.download(fs.createReadStream('/dev/null'))
    .should.be.rejectedWith('writeStream must be instance of stream.Writable.');
  });
});

describe('Asset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-single.json`, 'utf-8', (err, res) => {
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
  it('should get file url', () => {
    resource.getFileUrl().should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz.png');
  });
  it('should get image url', () => {
    resource.getImageUrl(1000).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_1024.png');
  });
  it('should get image thumb url', () => {
    resource.getImageThumbUrl(500).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_400_thumb.png');
  });
  it('should get file url', () => {
    resource.getFileUrl('de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz.png');
  });
  it('should get image url', () => {
    resource.getImageUrl(1000, 'de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_1024.png');
  });
  it('should get image thumb url', () => {
    resource.getImageThumbUrl(100, 'de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_100_thumb.png');
  });
  it('should get on svg image with resolution', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-single-svg.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(res));
      });
    })
    .then(data => new AssetResource(data))
    .then((asset) => {
      asset.getImageUrl(200).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/q-reMdqANeX4zuRGdK1OwhrR.svg');
    });
  });
  it('should get on image without thumbs', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-single-nothumbs.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(res));
      });
    })
    .then(data => new AssetResource(data))
    .then((asset) => {
      asset.getImageThumbUrl(200).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_256.png');
    });
  });
  it('should get on non image file', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-single-plain.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(res));
      });
    })
    .then(data => new AssetResource(data))
    .then((asset) => {
      asset.getFileUrl().should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/1-mt7_kX_DnyNbTQaSP4meVk.txt');
    });
  });
  it('should get with locale on no locale', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/asset-single-plain.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(res));
      });
    })
    .then(data => new AssetResource(data))
    .then((asset) => {
      asset.getFileUrl('de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/1-mt7_kX_DnyNbTQaSP4meVk.txt');
    });
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
