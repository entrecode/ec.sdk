/*eslint no-unused-expressions:0*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const resolver = require('../mocks/resolver');

const Api = require('../../lib/PublicAPI');
const helper = require('../../lib/helper');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
nock.disableNetConnect();

describe('PublicAPI', () => {
  let api;
  beforeEach(() => {
    api = new Api.default('beefbeef', 'live'); // eslint-disable-line new-cap
  });
  it('should be instance of PublicAPI', () => {
    api.should.be.instanceOf(Api.default);
  });
  it('should be instance of PublicAPI with live env', () => {
    api = new Api.default('beefbeef'); // eslint-disable-line new-cap
    api.should.be.instanceOf(Api.default);
    api.environment.should.be.equal('live');
  });
  it('should throw on missing id', () => {
    const throws = () => new Api.default(); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should throw on invalid id', () => {
    const throws = () => new Api.default('notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should throw on invalid environment', () => {
    const throws = () => new Api.default('beefbeef', 'notvalid'); // eslint-disable-line new-cap
    throws.should.throw(Error);
  });
  it('should resolve data manager root response', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.resolve()
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve data manager root response cache', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().throws(new Error('should not happen in tests'));

    return api.resolve()
    .then(() => api.resolve())
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should resolve data manager root response cache reload', () => {
    const stub = sinon.stub(helper, 'get');
    stub.onFirstCall().returns(resolver('public-dm-root.json'));
    stub.onSecondCall().returns(resolver('public-dm-root.json'));
    stub.onThirdCall().throws(new Error('should not happen in tests'));

    return api.resolve()
    .then(() => api.resolve(true))
    .then(() => {
      api.resource.should.have.property('dataManagerID', '48e18a34-cf64-4f4a-bc47-45323a7f0e44');
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should load modelLst', () => {
    const stub = sinon.stub(helper, 'get');
    stub.returns(resolver('public-dm-root.json'));

    return api.modelList()
    .then((list) => {
      list.should.be.instanceOf(Object);
      list.should.have.property('allFields');
      // TODO properties should be model objects
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });

  ['dataManagerID', 'title', 'description', 'locales',
    'defaultLocale', 'models', 'account', 'config']
  .forEach((property) => {
    it(`getter for ${property}`, () => {
      const stub = sinon.stub(helper, 'get');
      stub.returns(resolver('public-dm-root.json'));

      return api.resolve()
      .then(() => {
        api[property].should.be.defined;
        stub.restore();
      })
      .catch((err) => {
        stub.restore();
        throw err;
      });
    });
  });
});
