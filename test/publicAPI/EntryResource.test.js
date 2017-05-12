/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const mock = require('../mocks/nock');

const Resource = require('../../lib/resources/Resource').default;
const ListResource = require('../../lib/resources/ListResource').default;
const EntryList = require('../../lib/resources/publicAPI/EntryList');
const EntryResource = require('../../lib/resources/publicAPI/EntryResource');

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
    return EntryList.create(listJson, 'live', 'beefbeef:allFields')
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
  it('should have ModelResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(EntryResource.default));
  });
});

describe('Entry Resource', () => {
  let resourceJson;
  let resource;
  let getSpy;
  let setSpy;
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
    }));
  beforeEach(() => {
    mock.reset();
    return EntryResource.create(resourceJson)
    .then((res) => {
      resource = res;
      getSpy = sinon.spy(resource, 'getProperty');
      setSpy = sinon.spy(resource, 'setProperty');
    });
  });
  afterEach(() => {
    resource = null;
    getSpy.reset();
    setSpy.reset();
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenResource', () => {
    resource.should.be.instanceOf(EntryResource.default);
  });
  it('should throw on undefined schema', () => {
    const throws = () => new EntryResource.default(resourceJson); // eslint-disable-line new-cap
    throws.should.throw('schema must be defined');
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

  it('should get field with default getter', () => {
    resource.id.should.be.equal('B17u3r5lx-');
    getSpy.should.have.been.calledWith('_id');
  });
  it('should set field with default setter', () => {
    resource.id = '1234567';
    setSpy.should.have.been.calledWith('_id', '1234567');
  });

  it('should get datetime field', () => {
    resource.datetime.toISOString().should.be.equal('2017-04-29T22:00:00.000Z');
    resource.datetime.should.be.instanceOf(Date);
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
  it('should throw on set datetime field, not date string', () => {
    const throws = () => resource.datetime = 'hehe';
    throws.should.throw('input must be a Date or date string');
  });

  it('should get entry field', () => {
    resource.entry.should.be.equal('EJlJtSrkgl');
    getSpy.should.have.been.calledWith('entry');
  });
  it('should set entry field, string', () => {
    resource.entry = '1234567';
    setSpy.should.have.been.calledWith('entry', '1234567');
  });
  it('should set entry field, object', () => {
    resource.entry = { _id: '1234567' };
    setSpy.should.have.been.calledWith('entry', '1234567');
  });
  it('should set entry field, EntryResource', () => {
    resource.entry = resource;
    setSpy.should.have.been.calledWith('entry', resource.id);
  });
  it('should throw on set entry field, invalid object', () => {
    const throws = () => resource.entry = { invalid: 'object' };
    throws.should.throw('only string and object/EntryResource supported as input type');
  });

  it('should get entries field', () => {
    resource.entries.should.deep.equal(['EJlJtSrkgl']);
    getSpy.should.have.been.calledWith('entries');
  });
  it('should set entries field, string', () => {
    resource.entries = ['1234567'];
    setSpy.should.have.been.calledWith('entries', ['1234567']);
  });
  it('should set entries field, object', () => {
    resource.entries = [{ _id: '1234567' }];
    setSpy.should.have.been.calledWith('entries', ['1234567']);
  });
  it('should set entries field, EntryResource', () => {
    resource.entries = [resource];
    setSpy.should.have.been.calledWith('entries', [resource.id]);
  });
  it('should throw on set entries field, not an array', () => {
    const throws = () => resource.entries = {};
    throws.should.throw('only array supported as input type');
  });
  it('should throw on set entries field, invalid object', () => {
    const throws = () => resource.entries = [{ invalid: 'object' }];
    throws.should.throw('only string and object/EntryResource supported as input type');
  });

  it('should get asset field', () => {
    resource.asset.should.be.equal('03685901-8bbe-40a2-89f2-a7c9a5db5bf8');
    getSpy.should.have.been.calledWith('asset');
  });
  it('should set asset field, string', () => {
    resource.asset = 'df96ce29-d5a1-4a6f-9094-62506b708378';
    setSpy.should.have.been.calledWith('asset', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should set asset field, object', () => {
    resource.asset = { assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('asset', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it.skip('should set asset field, AssetResource', () => {
    resource.asset = { assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('asset', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should throw on set asset field, invalid object', () => {
    const throws = () => resource.asset = { invalid: 'object' };
    throws.should.throw('only string and object/AssetResource supported as input type');
  });

  it('should get assets field', () => {
    resource.assets.should.deep.equal(['03685901-8bbe-40a2-89f2-a7c9a5db5bf8']);
    getSpy.should.have.been.calledWith('assets');
  });
  it('should set assets field, string', () => {
    resource.assets = ['df96ce29-d5a1-4a6f-9094-62506b708378'];
    setSpy.should.have.been.calledWith('assets', ['df96ce29-d5a1-4a6f-9094-62506b708378']);
  });
  it('should set assets field, object', () => {
    resource.assets = [{ assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' }];
    setSpy.should.have.been.calledWith('assets', ['df96ce29-d5a1-4a6f-9094-62506b708378']);
  });
  it.skip('should set assets field, AssetResource', () => {
    resource.assets = [{ assetID: 'df96ce29-d5a1-4a6f-9094-62506b708378' }];
    setSpy.should.have.been.calledWith('assets', ['df96ce29-d5a1-4a6f-9094-62506b708378']);
  });
  it('should throw on set assets field, not an array', () => {
    const throws = () => resource.assets = {};
    throws.should.throw('only array supported as input type');
  });
  it('should throw on set assets field, invalid object', () => {
    const throws = () => resource.assets = [{ invalid: 'object' }];
    throws.should.throw('only string and object/AssetResource supported as input type');
  });

  it('should get account field', () => {
    resource.account.should.equal('03685901-8bbe-40a2-89f2-a7c9a5db5bf8');
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
  it.skip('should set account field, DMAccountResource', () => {
    resource.account = { accountID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('account', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should throw on set account field, invalid object', () => {
    const throws = () => resource.account = { invalid: 'object' };
    throws.should.throw('only string and object/DMAccountResource supported as input type');
  });

  it('should get role field', () => {
    resource.role.should.equal('03685901-8bbe-40a2-89f2-a7c9a5db5bf8');
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
  it.skip('should set role field, RoleResource', () => {
    resource.role = { roleID: 'df96ce29-d5a1-4a6f-9094-62506b708378' };
    setSpy.should.have.been.calledWith('role', 'df96ce29-d5a1-4a6f-9094-62506b708378');
  });
  it('should throw on set role field, invalid object', () => {
    const throws = () => resource.role = { invalid: 'object' };
    throws.should.throw('only string and object/RoleResource supported as input type');
  });

  it('should get entry title', () => {
    resource.getTitle().should.be.equal('B17u3r5lx-');
  });
  it('should get model title', () => {
    resource.getModelTitle().should.be.equal('allFields');
  });
  it('should get model title field', () => {
    resource.getModelTitleField().should.be.equal('_id');
  });
});
