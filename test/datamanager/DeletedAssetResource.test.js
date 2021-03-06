/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const DeletedAssetResource = require('../../lib/resources/datamanager/DeletedAssetResource').default;
const DeletedAssetList = require('../../lib/resources/datamanager/DeletedAssetList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const helper = require('../../lib/helper');

chai.should();
chai.use(sinonChai);

describe('DeletedAsset ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/deleted-asset-list.json`, 'utf-8', (err, res) => {
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
    list = new DeletedAssetList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(DeletedAssetList);
  });
  it('should have TokenResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(DeletedAssetResource));
  });
});

describe('DeletedAsset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/deleted-asset-single.json`, 'utf-8', (err, res) => {
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
    resource = new DeletedAssetResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenResource', () => {
    resource.should.be.instanceOf(DeletedAssetResource);
  });
  it('should get file url', () => {
    resource.getFileUrl().should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg.png');
  });
  it('should get image url', () => {
    resource
      .getImageUrl(500)
      .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg_512.png');
  });
  it('should get image thumb url', () => {
    resource
      .getImageThumbUrl(500)
      .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg_400_thumb.png');
  });
  it('should get file url', () => {
    resource
      .getFileUrl('de-DE')
      .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg.png');
  });
  it('should get image url', () => {
    resource
      .getImageUrl(500, 'de-DE')
      .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg_512.png');
  });
  it('should get image thumb url', () => {
    resource
      .getImageThumbUrl(100, 'de-DE')
      .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/lGft2gVDPmDt5NfA0HF2IlPg_100_thumb.png');
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
      .then((data) => new DeletedAssetResource(data))
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
      .then((data) => new DeletedAssetResource(data))
      .then((asset) => {
        asset
          .getImageThumbUrl(200)
          .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/J2DJfjfEVby3KcxGNrJyFdEz_256.png');
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
      .then((data) => new DeletedAssetResource(data))
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
      .then((data) => new DeletedAssetResource(data))
      .then((asset) => {
        asset
          .getFileUrl('de-DE')
          .should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/1-mt7_kX_DnyNbTQaSP4meVk.txt');
      });
  });
  it('should resolve on purge', () => {
    const stub = sinon.stub(helper, 'del');
    stub.returns(Promise.resolve());

    return resource
      .purge()
      .then(() => stub.restore())
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should resolve on restore', () => {
    const stub = sinon.stub(helper, 'del');
    stub.returns(Promise.resolve());

    return resource
      .restore()
      .then(() => stub.restore())
      .catch((err) => {
        stub.restore();
        throw err;
      });
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

  const getter = ['assetID', 'title', 'tags', 'type', 'files'];
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
});
