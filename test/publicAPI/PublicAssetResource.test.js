/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const resolver = require('./../mocks/resolver');
const helper = require('../../lib/helper');

const PublicAssetResource = require('../../lib/resources/publicAPI/PublicAssetResource').default;
const PublicAssetList = require('../../lib/resources/publicAPI/PublicAssetList').default;
const PublicTagResource = require('../../lib/resources/publicAPI/PublicTagResource').default;
const PublicTagList = require('../../lib/resources/publicAPI/PublicTagList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;

chai.should();
chai.use(sinonChai);

describe('Asset ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-asset-list.json`, 'utf-8', (err, res) => {
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
    list = new PublicAssetList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of TokenList', () => {
    list.should.be.instanceOf(PublicAssetList);
  });
  it('should have TokenResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(PublicAssetResource));
  });

  it('should load tag list', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-tag-list.json'));

    return list.tagList()
    .then((l) => {
      l.should.be.instanceof(PublicTagList);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should throw on tag list filtered with tag', () => {
    return list.tagList({ tag: 'id' })
    .should.be.rejectedWith('Cannot filter tagList only by tag. Use PublicAssetList#tag() instead');
  });
  it('should load tag resource', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('asset-single.json'));

    return list.tag('id')
    .then((model) => {
      model.should.be.instanceof(PublicTagResource);
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
});

describe('Asset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-asset.json`, 'utf-8', (err, res) => {
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
    resource = new PublicAssetResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of PublicAssetResource', () => {
    resource.should.be.instanceOf(PublicAssetResource);
  });
  it('should get file url', () => {
    resource.getFileUrl().should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0.png');
  });
  it('should get image url', () => {
    resource.getImageUrl(1000).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0_1024.png');
  });
  it('should get image thumb url', () => {
    resource.getImageThumbUrl(500).should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0_400_thumb.png');
  });
  it('should get file url', () => {
    resource.getFileUrl('de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0.png');
  });
  it('should get image url', () => {
    resource.getImageUrl(1000, 'de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0_1024.png');
  });
  it('should get image thumb url', () => {
    resource.getImageThumbUrl(100, 'de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/wFG3Al80jXjH06NIw3UWM2x0_100_thumb.png');
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
    .then(data => new PublicAssetResource(data))
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
    .then(data => new PublicAssetResource(data))
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
    .then(data => new PublicAssetResource(data))
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
    .then(data => new PublicAssetResource(data))
    .then((asset) => {
      asset.getFileUrl('de-DE').should.be.equal('https://cdn2.entrecode.de/files/01bd8e08/1-mt7_kX_DnyNbTQaSP4meVk.txt');
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

  const setter = ['title', 'tags'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });
});

describe('Lite Asset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-lite-asset.json`, 'utf-8', (err, res) => {
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
    resource = new PublicAssetResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of PublicAssetResource', () => {
    resource.should.be.instanceOf(PublicAssetResource);
  });
  it('should resolve', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('public-asset.json', null, true));

    return resource.resolve()
    .then((res) => {
      res.should.be.instanceof(PublicAssetResource);
      res.tags.should.have.property('length', 0);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve already resolved', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('public-asset.json', null, true));

    return resource.resolve()
    .then((res) => {
      res.should.be.instanceof(PublicAssetResource);
      res.tags.should.have.property('length', 0);
      stub.should.have.been.calledOnce;
      return res.resolve();
    })
    .then((res) => {
      res.should.be.instanceof(PublicAssetResource);
      res.tags.should.have.property('length', 0);
      stub.should.have.been.calledOnce;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be able to set tags on resolved', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('public-asset.json', null, true));

    return resource.resolve()
    .then((res) => {
      res.should.be.instanceof(PublicAssetResource);
      res.tags.should.have.property('length', 0);
      res.tags = ['hehe'];
      res.tags.should.have.property('length', 1);
      stub.restore();
    })
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

  const getter = ['assetID', 'title', 'type', 'files'];
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

  const setter = ['title'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });
});
