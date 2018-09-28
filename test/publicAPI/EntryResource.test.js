/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const resolver = require('../mocks/resolver');
const mock = require('../mocks/nock');

const helper = require('../../lib/helper');
const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const EntryList = require('../../lib/resources/publicAPI/EntryList');
const EntryResource = require('../../lib/resources/publicAPI/EntryResource');
const LiteEntryResource = require('../../lib/resources/publicAPI/LiteEntryResource');
const LiteDMAccountResource = require('../../lib/resources/publicAPI/LiteDMAccountResource').default;
const LiteRoleResource = require('../../lib/resources/publicAPI/LiteRoleResource').default;
const PublicAssetResource = require('../../lib/resources/publicAPI/PublicAssetResource').default;

const should = chai.should();
chai.use(sinonChai);

describe('Entry List', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-entry-list.json`, 'utf-8', (err, res) => {
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
    mock.reset();
    return EntryList.createList(listJson, 'live', undefined, 'beefbeef:allFields')
      .then(l => list = l); // eslint-disable-line no-return-assign
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of ModelList', () => {
    list.should.be.instanceOf(EntryList.default);
  });
  it('should have EntryResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(EntryResource.default));
  });
  it('should have EntryResource items', () => {
    list.getItem(0).should.be.instanceOf(EntryResource.default);
  });
});

describe('Entry Resource', () => {
  let resourceJson;
  let resource;
  let getSpy;
  let setSpy;
  let asset;
  before(() =>
    new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-entry.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        resourceJson = json;
        return new Promise((resolve, reject) => {
          fs.readFile(`${__dirname}/../mocks/public-asset.json`, 'utf-8', (err, res) => {
            if (err) {
              return reject(err);
            }
            return resolve(JSON.parse(res));
          });
        });
      })
      .then((json) => {
        asset = new PublicAssetResource(json);
      }));
  beforeEach(() => {
    mock.reset();
    return EntryResource.createEntry(resourceJson)
      .then((res) => {
        resource = res;
        getSpy = sinon.spy(resource, 'getProperty');
        setSpy = sinon.spy(resource, 'setProperty');
      });
  });
  afterEach(() => {
    resource = null;
    getSpy.resetHistory();
    setSpy.resetHistory();
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of EntryResource', () => {
    resource.should.be.instanceOf(EntryResource.default);
  });
  it('should throw on undefined schema', () => {
    const throws = () => new EntryResource.default(resourceJson); // eslint-disable-line new-cap
    throws.should.throw('schema must be defined');
  });
  it('should call put on save', () => {
    mock.reset();
    const stub = sinon.stub(helper, 'put');
    stub.returns(resolver('public-entry.json', resource._traversal));

    return resource.save()
      .then(() => {
        stub.should.be.calledOnce;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });

  it('should get id', () => {
    resource.id.should.be.equal('B17u3r5lx-');
  });
  it('should get _id', () => {
    resource._id.should.be.equal('B17u3r5lx-');
  });
  it('should get text', () => {
    resource.text.should.be.equal('asdf');
  });
  it('should get created', () => {
    resource.created.toISOString().should.be.equal('2017-05-10T13:29:19.893Z');
  });
  it('should get _created', () => {
    resource._created.toISOString().should.be.equal('2017-05-10T13:29:19.893Z');
  });
  it('should get modified', () => {
    resource.modified.toISOString().should.be.equal('2017-05-15T12:56:30.906Z');
  });
  it('should get _modified', () => {
    resource._modified.toISOString().should.be.equal('2017-05-15T12:56:30.906Z');
  });
  it('should get _creator', () => {
    should.equal(resource._creator, null);
  });
  it('should not include missing fields in original, CMS-2994', () => {
    const strippedResourceJson = JSON.parse(JSON.stringify(resourceJson));
    delete strippedResourceJson.decimal;
    delete strippedResourceJson.email;
    delete strippedResourceJson.json;
    return EntryResource.createEntry(strippedResourceJson)
      .then((res) => {
        res.should.have.property('boolean', true);
        res.should.have.property('decimal', undefined);
        res.should.have.property('email', undefined);
        res.should.have.property('json', undefined);
        const original = res.toOriginal();
        original.should.have.property('boolean', true);
        original.should.not.have.property('decimal');
        original.should.not.have.property('email');
        original.should.not.have.property('json');
      });
  });

  it('should get _entryTitle', () => {
    resource._entryTitle.should.be.equal('B17u3r5lx-');
  });
  it('should get field type', () => {
    resource.getFieldType('entry').should.be.equal('entry');
  });
  it('should return undefined on undefined field', () => {
    should.not.exist(resource.getFieldType());
  });
  it('should return undefined on missing field', () => {
    should.not.exist(resource.getFieldType('nonexistent'));
  });
  it('should return undefined on non matching type', () => {
    const res = new EntryResource.default(resourceJson, 'live', { // eslint-disable-line new-cap
      allOf: [
        null,
        {
          properties: {
            prop: {
              title: '<',
            },
          },
        },
      ],
    });
    should.not.exist(res.getFieldType('prop'));
  });
  it('should get levels', () => {
    resource.getLevelCount().should.be.equal(1);
  });

  it('should get field with default getter', () => {
    resource.id.should.be.equal('B17u3r5lx-');
    getSpy.should.have.been.calledWith('id');
  });
  it('should set field with default setter', () => {
    resource.number = 1234567;
    setSpy.should.have.been.calledWith('number', 1234567);
  });

  it('should get datetime field', () => {
    resource.datetime.toISOString().should.be.equal('2017-04-29T22:00:00.000Z');
    resource.datetime.should.be.instanceOf(Date);
    getSpy.should.have.been.calledWith('datetime');
  });
  it('should get datetime null', () => {
    resource.datetime = null;
    should.equal(resource.datetime, null);
    getSpy.should.have.been.calledWith('datetime');
  });
  it('should set datetime field, date', () => {
    const date = new Date();
    resource.datetime = date;
    setSpy.should.have.been.calledWith('datetime', date.toISOString());
  });
  it('should set datetime field, string', () => {
    const date = new Date();
    resource.datetime = date.toISOString();
    setSpy.should.have.been.calledWith('datetime', date.toISOString());
  });
  it('should set datetime field, null', () => {
    resource.datetime = null;
    setSpy.should.have.been.calledWith('datetime', null);
  });
  it('should throw on set datetime field, not date string', () => {
    const throws = () => {
      resource.datetime = 'hehe';
    };
    throws.should.throw('input must be a Date, date string or null');
  });

  it('should get entry field', () => {
    resource.entry.should.be.instanceOf(LiteEntryResource.default);
    getSpy.should.have.been.calledWith('entry');
  });
  it('should get entry field #2', () => {
    const { entry } = resource;
    entry.should.be.instanceOf(LiteEntryResource.default);
    resource.entry.should.be.instanceOf(LiteEntryResource.default);
    getSpy.should.have.been.calledWith('entry');
  });
  it('should set entry field, string', () => {
    resource.entry = '1234567';
    setSpy.should.have.been.calledWith('entry', '1234567');
  });
  it('should set entry field, object', () => {
    resource.entry = { _id: '1234567' };
    setSpy.should.have.been.calledWith('entry', { _id: '1234567' });
  });
  it('should set entry field, EntryResource', () => {
    const original = resource.toOriginal();
    resource.entry = resource;
    setSpy.should.have.been.calledWith('entry', original);
  });
  it('should set entry field, null', () => {
    resource.entry = null;
    setSpy.should.have.been.calledWith('entry', null);
  });
  it('should throw on set entry field, invalid object', () => {
    const throws = () => {
      resource.entry = { invalid: 'object' };
    };
    throws.should.throw('input must be a String, object/[Lite]EntryResource or null');
  });

  it('should get entries field', () => {
    const { entries } = resource;
    entries.should.have.property('length', 2);
    entries[0].should.be.instanceOf(LiteEntryResource.default);
    entries[0].should.have.property('_id', 'EJlJtSrkgl');
    entries[1].should.be.equal('ejLjTsRKGl');
    getSpy.should.have.been.calledWith('entries');
  });
  it('should get entries field #2', () => {
    const { entries } = resource;
    const entries2 = resource.entries;
    entries.should.have.property('length', 2);
    entries[0].should.be.instanceOf(LiteEntryResource.default);
    entries[0].should.have.property('_id', 'EJlJtSrkgl');
    entries2[1].should.be.equal('ejLjTsRKGl');
  });
  it('should set entries field, string', () => {
    resource.entries = ['1234567'];
    setSpy.should.have.been.calledWith('entries', ['1234567']);
  });
  it('should set entries field, object', () => {
    resource.entries = [{ _id: '1234567' }];
    setSpy.should.have.been.calledWith('entries', [{ _id: '1234567' }]);
  });
  it('should set entries field, EntryResource', () => {
    const original = resource.toOriginal();
    resource.entries = [resource];
    setSpy.should.have.been.calledWith('entries', [original]);
  });
  it('should throw on set entries field, not an array', () => {
    const throws = () => {
      resource.entries = {};
    };
    throws.should.throw('only array supported as input type');
  });
  it('should throw on set entries field, invalid object', () => {
    const throws = () => {
      resource.entries = [{ invalid: 'object' }];
    };
    throws.should.throw('only string and object/[Lite]EntryResource supported as input type');
  });

  it('should get asset field', () => {
    resource.asset.assetID.should.be.equal('2bf325a9-c8f9-4e7d-b244-faa1090a479d');
    getSpy.should.have.been.calledWith('asset');
  });
  it('should set asset field, string', () => {
    resource.asset = 'df96ce29-d5a1-4a6f-9094-62506b708378';
    setSpy.should.have.been.calledWith('asset', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set asset field, object', () => {
    resource.asset = { assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('asset', { assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' });
  });
  it('should set asset field, AssetResource', () => {
    const original = asset.toOriginal();
    resource.asset = asset;
    setSpy.should.have.been.calledWith('asset', original);
  });
  it('should set asset field, null', () => {
    resource.asset = null;
    setSpy.should.have.been.calledWith('asset', null);
  });
  it('should throw on set asset field, invalid object', () => {
    const throws = () => {
      resource.asset = { invalid: 'object' };
    };
    throws.should.throw('only string, object/AssetResource/DMAssetResource, and null supported as input type');
  });

  it('should get assets field', () => {
    const { assets } = resource;
    assets.should.have.property('length', 2);
    assets[0].should.have.property('assetID', '2bf325a9-c8f9-4e7d-b244-faa1090a479d');
    assets[1].should.be.equal('5cd2b613-9cc7-4770-88b8-69906bfb796d');
    getSpy.should.have.been.calledWith('assets');
  });
  it('should set assets field, string', () => {
    resource.assets = ['df96ce29-d5a1-4a6f-9094-62506b708378'];
    setSpy.should.have.been.calledWith('assets', ['df96ce29-d5a1-4a6f-9094-62506b708378']);
  });
  it('should set assets field, object', () => {
    resource.assets = [{ assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' }];
    setSpy.should.have.been.calledWith('assets', [{ assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' }]);
  });
  it('should set assets field, AssetResource', () => {
    const original = asset.toOriginal();
    resource.assets = [asset];
    setSpy.should.have.been.calledWith('assets', [original]);
  });
  it('should throw on set assets field, not an array', () => {
    const throws = () => {
      resource.assets = {};
    };
    throws.should.throw('only array supported as input type');
  });
  it('should throw on set assets field, invalid object', () => {
    const throws = () => {
      resource.assets = [{ invalid: 'object' }];
    };
    throws.should.throw('only string and object/AssetResource/DMAssetResource supported as input type');
  });

  it('should get account field', () => {
    resource.account.should.be.instanceOf(LiteDMAccountResource);
    resource.account.accountID.should.equal('49518e7d-a8b0-444a-b829-7fe3c86810ab');
    getSpy.should.have.been.calledWith('account');
  });
  it('should set account field, string', () => {
    resource.account = 'df96ce29-d5a1-4a6f-9094-62506b708378';
    setSpy.should.have.been.calledWith('account', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set account field, object', () => {
    resource.account = { accountID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('account', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set account field, LiteDMAccountResource', () => {
    const account = new LiteDMAccountResource({
      profile: 'https://entrecode.de/schema/dm-account',
      href: 'https://datamanager.entrecode.de/account?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44&accountID=49518e7d-a8b0-444a-b829-7fe3c86810ab',
      title: null,
    });
    resource.account = account;
    setSpy.should.have.been.calledWith('account', '49518e7d-a8b0-444a-b829-7fe3c86810ab');
  });
  it('should set account field, null', () => {
    resource.account = null;
    setSpy.should.have.been.calledWith('account', null);
  });
  it('should throw on set account field, invalid object', () => {
    const throws = () => {
      resource.account = { invalid: 'object' };
    };
    throws.should.throw('only string, object/DMAccountResource, and null supported as input type');
  });

  it('should get role field', () => {
    resource.role.should.be.instanceOf(LiteRoleResource);
    resource.role.roleID.should.equal('3779d1ee-ce4f-4081-b2a7-6245e8540b18');
    getSpy.should.have.been.calledWith('role');
  });
  it('should set role field, string', () => {
    resource.role = 'df96ce29-d5a1-4a6f-9094-62506b708378';
    setSpy.should.have.been.calledWith('role', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set role field, object', () => {
    resource.role = { roleID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('role', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set role field, LiteRoleResource', () => {
    const role = new LiteRoleResource({
      profile: 'https://entrecode.de/schema/dm-role',
      href: 'https://datamanager.entrecode.de/role?dataManagerID=48e18a34-cf64-4f4a-bc47-45323a7f0e44&roleID=3779d1ee-ce4f-4081-b2a7-6245e8540b18',
      title: 'Registered Users',
    });
    resource.role = role;
    setSpy.should.have.been.calledWith('role', '3779d1ee-ce4f-4081-b2a7-6245e8540b18');
  });
  it('should set role field, null', () => {
    resource.role = null;
    setSpy.should.have.been.calledWith('role', null);
  });
  it('should throw on set role field, invalid object', () => {
    const throws = () => {
      resource.role = { invalid: 'object' };
    };
    throws.should.throw('only string, object/RoleResource, and null supported as input type');
  });

  it('should get entry title', () => {
    resource.getTitle().should.be.equal('B17u3r5lx-');
  });
  it('should get entry title of nested entry', () => {
    resource.getTitle('entry').should.be.equal('EJlJtSrkgl');
  });
  it('should get entry title of nested entries', () => {
    resource.getTitle('entries').should.have.members(['EJlJtSrkgl']);
  });
  it('should be undefined on missing field title', () => {
    should.equal(resource.getTitle('notAvailable'), undefined);
  });
  it('should get model title', () => {
    resource.getModelTitle().should.be.equal('allFields');
  });
  it('should get model title field', () => {
    resource.getModelTitleField().should.be.equal('_id');
  });

  it('should get file url, asset', () => {
    resource.getFileUrl('asset').should.be.equal('https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0.png');
  });
  it('should be undefined, asset', () => {
    should.not.exist(resource.getFileUrl('nonono'));
  });
  it('should get file url, assets', () => {
    resource.getFileUrl('assets').should.be.deep.equal(['https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0.png']);
  });
  it('should be empty array, assets', () => {
    resource.getFileUrl('emptyAssets').should.have.property('length', 0);
  });
  it('should get image url, asset', () => {
    resource.getImageUrl('asset', 500).should.be.equal('https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0_512.png');
  });
  it('should be undefined, asset', () => {
    should.not.exist(resource.getImageUrl('nonono'));
  });
  it('should get image url, assets', () => {
    resource.getImageUrl('assets', 500).should.be.deep.equal(['https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0_512.png']);
  });
  it('should be empty array, assets', () => {
    resource.getImageUrl('emptyAssets').should.have.property('length', 0);
  });
  it('should get thumb url, asset', () => {
    resource.getImageThumbUrl('asset', 200).should.be.equal('https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0_200_thumb.png');
  });
  it('should be undefined, asset', () => {
    should.not.exist(resource.getImageThumbUrl('nonono'));
  });
  it('should get thumb url, assets', () => {
    resource.getImageThumbUrl('assets', 200).should.be.deep.equal(['https://cdn2.entrecode.de/files/beefbeef/wFG3Al80jXjH06NIw3UWM2x0_200_thumb.png']);
  });
  it('should be empty array, assets', () => {
    resource.getImageThumbUrl('emptyAssets').should.have.property('length', 0);
  });

  it('should be clean', () => {
    resource.isDirty.should.be.false;
  });
  it('should be dirty on json field change', () => {
    resource.json.hello = 'testing';
    resource.isDirty.should.be.true;
  });

  it('should validate', () => {
    return resource.validateField('text').should.eventually.equal(true);
  });
  it('should not validate', () => {
    resource.text = 1;
    return resource.validateField('text').should.be.rejectedWith('Invalid format for property in JSON body');
  });
  it('should resolve with levels', () => {
    const getUrlStub = sinon.stub(helper, 'getUrl');
    getUrlStub.returns(Promise.resolve('https://datamanager.entrecode.de/api/beefbeef/allFields?_id=B17u3r5lx-'));
    const getStub = sinon.stub(helper, 'get');
    getStub.returns(resolver('public-entry-nested.json'));

    return resource.resolve(2)
      .then(() => {
        getUrlStub.restore();
        getStub.restore();
      })
      .catch((err) => {
        getUrlStub.restore();
        getStub.restore();
        throw err;
      });
  });
});

describe('Entry Resource with nested', () => {
  let resJson;
  let res;
  before(() =>
    new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-entry-nested.json`, 'utf-8', (err, json) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(json));
      });
    })
      .then((json) => {
        resJson = json;
      }));
  beforeEach(() => {
    mock.reset();
    return EntryResource.createEntry(resJson)
      .then((r) => {
        res = r;
      });
  });
  afterEach(() => {
    res = null;
  });
  it('should get levels', () => {
    res.getLevelCount().should.be.equal(2);
  });
  it('should get nested entry, entry', () => {
    res.entry.should.be.instanceOf(EntryResource.default);
  });
  it('should get null on entry', () => {
    const nullJson = Object.assign({}, resJson);
    nullJson.entry = null;
    return EntryResource.createEntry(nullJson)
      .then((r) => {
        should.equal(r.entry, null);
      });
  });
  it('should get nested entry, entries', () => {
    res.entries.forEach((entry) => {
      entry.should.be.instanceOf(EntryResource.default);
    });
    res.entries.forEach((entry) => {
      entry.should.be.instanceOf(EntryResource.default);
    });
  });
  it('should get empty array, entries', () => {
    const nullJson = Object.assign({}, resJson);
    nullJson.entries = null;
    return EntryResource.createEntry(nullJson)
      .then((r) => {
        r.entries.should.be.an('array');
        r.entries.should.have.property('length', 0);
      });
  });
  it('should get nested asset, asset', () => {
    res.asset.should.be.instanceOf(PublicAssetResource);
  });
  it('should get null on asset', () => {
    const nullJson = Object.assign({}, resJson);
    nullJson.asset = null;
    return EntryResource.createEntry(nullJson)
      .then((r) => {
        should.equal(r.asset, null);
      });
  });
  it('should get nested asset, assets', () => {
    res.assets.forEach((asset) => {
      asset.should.be.instanceOf(PublicAssetResource);
    });
    res.assets.forEach((asset) => {
      asset.should.be.instanceOf(PublicAssetResource);
    });
  });
  it('should get empty array, assets', () => {
    const nullJson = Object.assign({}, resJson);
    nullJson.assets = null;
    return EntryResource.createEntry(nullJson)
      .then((r) => {
        r.assets.should.be.an('array');
        r.assets.should.have.property('length', 0);
      });
  });
});

describe('Entry Resource with nested and array links', () => {
  let resJson;
  let res;
  before(() =>
    new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-entry-nested-linkarrays.json`, 'utf-8', (err, json) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(json));
      });
    })
      .then((json) => {
        resJson = json;
      }));
  beforeEach(() => {
    mock.reset();
    return EntryResource.createEntry(resJson)
      .then((r) => {
        res = r;
      });
  });
  afterEach(() => {
    res = null;
  });
  it('should get nested entry, entry', () => {
    res.entry.should.be.instanceOf(EntryResource.default);
  });
  it('should get nested entry, entries', () => {
    res.entries.forEach((entry) => {
      entry.should.be.instanceOf(EntryResource.default);
    });
    res.entries.forEach((entry) => {
      entry.should.be.instanceOf(EntryResource.default);
    });
  });
  it('should get nested asset, asset', () => {
    res.asset.should.be.instanceOf(PublicAssetResource);
  });
  it('should get nested asset, assets', () => {
    res.assets.forEach((asset) => {
      asset.should.be.instanceOf(PublicAssetResource);
    });
    res.assets.forEach((asset) => {
      asset.should.be.instanceOf(PublicAssetResource);
    });
  });
});

describe('LiteEntry Resource', () => {
  let resourceJson;
  let resource;
  let getSpy;
  before(() =>
    new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/public-lite-entry.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
      .then((json) => {
        resourceJson = json;
        return new Promise((resolve, reject) => {
          fs.readFile(`${__dirname}/../mocks/public-asset.json`, 'utf-8', (err, res) => {
            if (err) {
              return reject(err);
            }
            return resolve(JSON.parse(res));
          });
        });
      })
      .then((json) => {
        asset = new PublicAssetResource(json);
      }));
  beforeEach(() => {
    mock.reset();
    resource = new LiteEntryResource.default(resourceJson);
    getSpy = sinon.spy(resource, 'getProperty');
  });
  afterEach(() => {
    resource = null;
    getSpy.resetHistory();
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of LiteEntryResource', () => {
    resource.should.be.instanceOf(LiteEntryResource.default);
  });
  it('should throw on save', () => {
    const throws = () => resource.save();
    throws.should.throw('LiteEntryResource cannot be saved');
  });
  it('should resolve', () => {
    const stub = sinon.stub(helper, 'superagentGet');
    stub.returns(resolver('public-entry.json', null, true));

    return resource.resolve()
      .then((res) => {
        res.should.be.instanceOf(EntryResource.default)
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
  });
  it('should get id', () => {
    resource.id.should.be.equal('B17u3r5lx-');
  });
  it('should get _id', () => {
    resource._id.should.be.equal('B17u3r5lx-');
  });
  it('should get _entryTitle', () => {
    resource._entryTitle.should.be.equal('B17u3r5lx-');
  });
  it('should get entry title', () => {
    resource.getTitle().should.be.equal('B17u3r5lx-');
  });
  it('should throw on getTitle with fields property', () => {
    const throws = () => resource.getTitle('asdf');
    throws.should.throw('getTitle with field argument not supported by LiteEntryResource');
  });
  it('should get model title', () => {
    resource.getModelTitle().should.be.equal('allFields');
  });
});
