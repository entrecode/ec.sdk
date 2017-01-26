const CookieMock = require('ec.cookie-mock');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Accounts = require('../lib/Accounts').default;
const Resource = require('../lib/resources/Resource').default;
const Core = require('../lib/Core');
const resolver = require('./mocks/resolver');
const emitter = require('../lib/EventEmitter').default;

chai.should();
chai.use(sinonChai);

describe('Cookie and Token handling', () => {
  beforeEach(() => {
    document = new CookieMock(); // eslint-disable-line no-undef
  });
  afterEach(() => {
    document = undefined; // eslint-disable-line no-undef
  });
  it('should save cookie', () => {
    const accounts = new Accounts();
    const stub = sinon.stub(Core, 'post');
    stub.returns(resolver('login-token.json'));

    accounts.setClientID('rest');
    return accounts.login('andre@entrecode.de', 'mysecret')
    .then((token) => {
      document.cookie.indexOf(token).should.be.not.equal(-1); // eslint-disable-line no-undef
      stub.restore();
    })
    .catch((err) => {
      stub.restore();
      throw err;
    });
  });
  it('should set token on saved cookie Core', () => {
    const expires = new Date(new Date().getTime() + 60000).toUTCString();
    document.cookie = `accessToken=token; expires=${expires}`; // eslint-disable-line no-undef
    const accounts = new Accounts();
    accounts.should.have.deep.property('traversal.requestOptions.headers.Authorization', 'Bearer token');
  });
  it('should set token on saved cookie Resource', () => {
    const expires = new Date(new Date().getTime() + 60000).toUTCString();
    document.cookie = `accessToken=token; expires=${expires}`; // eslint-disable-line no-undef
    const resource = new Resource({ _links: { self: { href: 'http://entrecode.de' } } });
    resource.should.have.deep.property('traversal.requestOptions.headers.Authorization', 'Bearer token');
  });
  it('should do nothing on no cookie', () => {
    const accounts = new Accounts();
    accounts.should.not.have.deep.property('traversal.requestOptions.headers.Authorization');
  });
  it('should set token on login event Core', () => {
    const accounts = new Accounts();
    accounts.should.not.have.deep.property('traversal.requestOptions.headers.Authorization');
    emitter.emit('login', 'token');
    accounts.should.have.deep.property('traversal.requestOptions.headers.Authorization', 'Bearer token');
  });
  it('should set token on login event Resource', () => {
    const resource = new Resource({ _links: { self: { href: 'http://entrecode.de' } } });
    resource.should.not.have.deep.property('traversal.requestOptions.headers.Authorization');
    emitter.emit('login', 'token');
    resource.should.have.deep.property('traversal.requestOptions.headers.Authorization', 'Bearer token');
  });
});
