/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const DMAssetResource = require('../../lib/resources/publicAPI/DMAssetResource').default;
const DMAssetList = require('../../lib/resources/publicAPI/DMAssetList').default;
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const helper = require('../../lib/helper');
const resolver = require('../mocks/resolver');

const should = chai.should();
chai.use(sinonChai);

describe('DMAsset ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-asset-list.json`, 'utf-8', (err, res) => {
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
    list = new DMAssetList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of DMAssetList', () => {
    list.should.be.instanceOf(DMAssetList);
  });
  it('should have DMAssetResource items', () => {
    list.getAllItems().forEach((item) => item.should.be.instanceOf(DMAssetResource));
  });
});

describe('DMAsset Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/dm-asset-single.json`, 'utf-8', (err, res) => {
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
    resource = new DMAssetResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of DMAssetResource', () => {
    resource.should.be.instanceOf(DMAssetResource);
  });
  it('should get file url', () => {
    resource.getFileUrl().should.be.equal('https://cdn1.entrecode.de/beefbeef/test1/7mGEhlUXvdxuoCf0vQWtLNQW.jpg');
  });
  it('should get original file', () => {
    resource.getOriginalFile().should.deep.equal({
      url: 'https://cdn1.entrecode.de/beefbeef/test1/7mGEhlUXvdxuoCf0vQWtLNQW.jpg',
      size: 3644378,
      resolution: {
        width: 2736,
        height: 4864,
      },
    });
  });
  it('should get image variant', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-asset-bestfile.json'));
    return resource
      .getImageUrl(500)
      .should.eventually.equal('https://cdn1.buffalo.entrecode.de/ab5047fc/test1/7mGEhlUXvdxuoCf0vQWtLNQW.jpg')
      .notify(() => {
        stub.restore();
      });
  });
  it('should get image variant, local match', () => {
    return resource
      .getImageUrl(700)
      .should.eventually.equal('https://cdn1.entrecode.de/beefbeef/test1/7mGEhlUXvdxuoCf0vQWtLNQW_700.jpg');
  });
  it('should get image variant, local match, jpeg', () => {
    return resource
      .getImageUrl(700, 'jpeg')
      .should.eventually.equal('https://cdn1.entrecode.de/beefbeef/test1/7mGEhlUXvdxuoCf0vQWtLNQW_700.jpg');
  });
  it('should get image variant, local match, webp', () => {
    return resource
      .getImageUrl(700, 'webp')
      .should.eventually.equal('https://cdn1.entrecode.de/beefbeef/test1/7mGEhlUXvdxuoCf0vQWtLNQW_700.webp');
  });
  it('should get thumbnail', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('dm-asset-bestfile.json'));

    return resource
      .getImageThumbUrl(50)
      .should.eventually.equal('https://cdn1.buffalo.entrecode.de/ab5047fc/test1/7mGEhlUXvdxuoCf0vQWtLNQW.jpg')
      .notify(() => {
        stub.restore();
      });
  });
  it('should have assetGroupID property', () => {
    resource.assetGroupID.should.be.equal('test1');
  });

  const dateGetter = ['created', 'modified'];
  dateGetter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name);
      if (property && 'toISOString' in property) {
        property.toISOString().should.be.equal(resource.getProperty(name));
      } else {
        should.equal(property, resource.getProperty(name));
      }

      spy.restore();
    });
  });

  const getter = [
    'assetID',
    'title',
    'caption',
    'tags',
    'type',
    'file',
    'mimetype',
    'caption',
    'creator',
    'creatorType',
    'fileVariants',
    'thumbnails',
    'isUsed',
    'isIncomplete',
    'duplicates',
    '_links',
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

  const setter = ['title', 'tags', 'caption'];
  setter.forEach((name) => {
    it(`should call resource.setProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'setProperty');

      resource[name] = resource.getProperty(name);
      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(name, resource.getProperty(name));

      spy.restore();
    });
  });

  it('should call resource.setProperty with tag on tag objects', () => {
    const spy = sinon.spy(resource, 'setProperty');

    resource.tags = [{ tag: 'tag' }];
    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWith('tags');

    spy.restore();
  });
});
