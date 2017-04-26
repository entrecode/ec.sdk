/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const ListResource = require('../../lib/resources/ListResource').default;
const TemplateList = require('../../lib/resources/datamanager/TemplateList').default;
const TemplateResource = require('../../lib/resources/datamanager/TemplateResource').default;
const DataManagerResource = require('../../lib/resources/datamanager/DataManagerResource').default;
const Resource = require('../../lib/resources/Resource').default;
const helper = require('../../lib/helper');

const resolver = require('../mocks/resolver');

chai.should();
chai.use(sinonChai);

describe('Template ListResource', () => {
  let listJson;
  let list;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/template-list.json`, 'utf-8', (err, res) => {
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
    list = new TemplateList(listJson);
  });
  afterEach(() => {
    list = null;
  });
  it('should be instance of ListResource', () => {
    list.should.be.instanceOf(ListResource);
  });
  it('should be instance of DMAccountList', () => {
    list.should.be.instanceOf(TemplateList);
  });
  it('should have AccountResource items', () => {
    list.getAllItems().forEach(item => item.should.be.instanceOf(TemplateResource));
  });
});

describe('Template Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/template-single.json`, 'utf-8', (err, res) => {
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
    resource = new TemplateResource(resourceJson);
    resource.resolved = true;
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of AccountResource', () => {
    resource.should.be.instanceOf(TemplateResource);
  });
  it('should resolve on resolve', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('template-single.json'));

    return resource.resolve()
    .then((template) => {
      template.should.be.instanceOf(TemplateResource);
      resource.should.be.equal(template);
      resource.resolved.should.be.true;
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve on createDM', () => {
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('dm-single.json'));

    return resource.createDM()
    .then((dm) => {
      dm.should.be.instanceOf(DataManagerResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve on createDM with unresolved', () => {
    const get = sinon.stub(helper, 'get');
    get.returns(resolver('template-single.json'));
    const post = sinon.stub(helper, 'post');
    post.returns(resolver('dm-single.json'));

    resource.resolved = false;

    return resource.createDM()
    .then((dm) => {
      dm.should.be.instanceOf(DataManagerResource);
      resource.resolved.should.be.true;
      get.restore();
      post.restore();
    })
    .catch((err) => {
      get.restore();
      post.restore();
      throw err;
    });
  });
  it('should resolve on updateDM', () => {
    const stub = sinon.stub(helper, 'put');
    stub.returns(resolver('dm-single.json'));

    return resource.updateDM('id')
    .then((dm) => {
      dm.should.be.instanceOf(DataManagerResource);
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should be rejected on updateDM withoud dmID', () => {
    return resource.updateDM()
    .should.be.rejectedWith('Must provide dataManagerID for update.');
  });

  const getter = ['templateID', 'name', 'collection', 'dataSchema', 'version'];
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
});
