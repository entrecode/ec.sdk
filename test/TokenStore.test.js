/* eslint no-unused-expressions:0 */

const chai = require('chai');
const CookieMock = require('ec.cookie-mock');
const cookie = require('browser-cookies');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const TokenStore = require('../lib/TokenStore');

const should = chai.should();
chai.use(sinonChai);

describe('Token handling', () => {
  const token =
    'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNjaGVyemluZ2VyQGVudHJlY29kZS5kZSIsImp0aSI6IjEwODRlMGRmLTg1NzktNGRmMC1hNjc4LTk5M2QwMDNkY2QyNSIsImlhdCI6MTQ4MjUwNTcxMywiZXhwIjoxNDg1MDk3NzEzLCJpc3MiOiJlbnRyZWNvZGUiLCJzdWIiOiJkZGQyOWZkMS03NDE3LTQ4OTQtYTU0Ni01YzEyYjExYzAxODYifQ.Z2UA2EkFUMPvj5AZX5Ox5-pHiQsfw1Jjvq7sqXDT4OfdOFdGMHvKDLsJm1aVWWga5PMLSpKPucYYk_MrDTjYFp1HJhn97B1VwO62psP-Z6BMFgIPpQNB0f-_Mgth4OGucpLajoGgw9PemmHGWvyStC1Gzg9QBdKCch4VNjKvgg33puyZ5DA9YvldjUTQVhl02rHQspf4dfAz7DQHCJJN_tFhXXLpYzg_pQOu6L-yowsEFlLhl9SZoidz9v8T4PMio04g9wauilu0-ZXGRMRHKk2RYqlRaSc4QLSRZnyefdjp1_Xk7q9dG0Fn71YWxClXYlf2hycuzO2bg1-JBElxzQ';
  let store;
  beforeEach(() => {
    store = TokenStore.default('test');
  });
  afterEach(() => {
    store = null;
    TokenStore.stores.clear();
  });
  it('should get token store', () => {
    const store1 = TokenStore.default('live');
    store1.should.be.exist; // eslint-disable-line no-unused-expressions
  });
  it('should get identical token store', () => {
    const store1 = TokenStore.default();
    const store2 = TokenStore.default('live');
    store1.should.be.equal(store2);
  });
  it('should get different token stores', () => {
    const store1 = TokenStore.default('live');
    const store2 = TokenStore.default('stage');
    store1.should.not.be.equal(store2);
  });
  it('should set token', () => {
    store.setToken(token);
    store.token.should.be.equal(token);
  });
  it('should set refresh token', () => {
    store.setRefreshToken(token);
    store.refreshToken.should.be.equal(token);
  });
  it('should throw on undefined token', () => {
    const throws = () => store.setToken();
    throws.should.throw(Error);
  });
  it('should throw on undefined refresh token', () => {
    const throws = () => store.setRefreshToken();
    throws.should.throw(Error);
  });
  it('should throw on invalid token', () => {
    const throws = () => store.setToken('notAJwt');
    throws.should.throw(Error);
  });
  it('should throw on invalid refresh token', () => {
    const throws = () => store.setRefreshToken('notAJwt');
    throws.should.throw(Error);
  });
  it('should get token', () => {
    store.setToken(token);
    store.getToken().should.be.equal(token);
  });
  it('should get refresh token', () => {
    store.setRefreshToken(token);
    store.getRefreshToken().should.be.equal(token);
  });
  it('should return true on has token', () => {
    store.setToken(token);
    store.hasToken().should.be.equal(true);
  });
  it('should return true on has refresh token', () => {
    store.setRefreshToken(token);
    store.hasRefreshToken().should.be.equal(true);
  });
  it('should return false on has token', () => {
    store.hasToken().should.be.equal(false);
  });
  it('should return false on has refresh token', () => {
    store.hasRefreshToken().should.be.equal(false);
  });
  it('should delete token', () => {
    store.setToken(token);
    store.deleteToken();
    should.not.exist(store.token);
  });
  it('should delete refresh token', () => {
    store.setRefreshToken(token);
    store.deleteRefreshToken();
    should.not.exist(store.refreshToken);
  });
  it('should set clientID', () => {
    store.setClientID('rest');
    store.clientID.should.be.equal('rest');
  });
  it('should throw on undefined clientID', () => {
    const throws = () => store.setClientID();
    throws.should.throw(Error);
  });
  it('should get clientID', () => {
    store.clientID = 'rest';
    store.getClientID().should.be.equal('rest');
  });
  it('should return true on hasClientID', () => {
    store.clientID = 'rest';
    store.hasClientID().should.be.true;
  });
  it('should return false on hasClientID', () => {
    store.clientID = undefined;
    store.hasClientID().should.be.false;
  });
  it('should set user agent', () => {
    store.setUserAgent('agent/1.0.0');
    store.agent.should.be.equal('agent/1.0.0');
  });
  it('should set fancy user agent', () => {
    store.setUserAgent(
      'Mozilla/5.0 (Linux; Android 11; M2101K6G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36',
    );
    store.agent.should.be.equal(
      'Mozilla/5.0 (Linux; Android 11; M2101K6G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36',
    );
  });
  it('should throw on undefined user agent', () => {
    const throws = () => store.setUserAgent();
    throws.should.throw('agent cannot be undefined');
  });
  it('should throw on malformed user agent', () => {
    const throws = () => store.setUserAgent('agent');
    throws.should.throw('agent is malformed');
  });
  it('should get user agent', () => {
    store.agent = 'agent';
    store.getUserAgent().should.be.equal('agent');
  });
  it('should return true on hasUserAgent', () => {
    store.agent = 'agent';
    store.hasUserAgent().should.be.true;
  });
  it('should return false on hasUserAgent', () => {
    store.agent = undefined;
    store.hasUserAgent().should.be.false;
  });
});

describe('Token handling with cookie store', () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8';
  let store;
  before(() => {
    document = new CookieMock(); // eslint-disable-line no-undef
    store = TokenStore.default('test');
  });
  after(() => {
    store = null;
    document = undefined; // eslint-disable-line no-undef
    TokenStore.stores.clear();
  });
  it('should get token store', () => {
    const store1 = TokenStore.default('live');
    should.exist(store1);
  });
  it('should get identical token store', () => {
    const store1 = TokenStore.default();
    const store2 = TokenStore.default('live');
    store1.should.be.equal(store2);
  });
  it('should get different token stores', () => {
    const store1 = TokenStore.default('live');
    const store2 = TokenStore.default('stage');
    store1.should.not.be.equal(store2);
  });
  it('should set token', () => {
    store.setToken(token);
    cookie.get('testToken').should.be.equal(token);
    store.token.should.be.equal(token);
  });
  it('should warn on outdated token', () => {
    const stub = sinon.stub(console, 'warn');
    store.setToken(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0Ijo0ODU3ODM1ODgsImV4cCI6NjQxNDU3MTg4LCJhdWQiOiJUZXN0Iiwic3ViIjoidGVzdEBlbnRyZWNvZGUuZGUifQ.3oazgwQUfdwP4cCgke7eVWLcMo_xkqHhlUBdyL60Vp0',
    );
    should.equal(cookie.get('testToken'), null);
    store.token.should.be.equal(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0Ijo0ODU3ODM1ODgsImV4cCI6NjQxNDU3MTg4LCJhdWQiOiJUZXN0Iiwic3ViIjoidGVzdEBlbnRyZWNvZGUuZGUifQ.3oazgwQUfdwP4cCgke7eVWLcMo_xkqHhlUBdyL60Vp0',
    );
    stub.should.have.callCount(1);
    stub.restore();
  });
  it('should throw on undefined token', () => {
    const throws = () => store.setToken();
    throws.should.throw(Error);
  });
  it('should throw on invalid token', () => {
    const throws = () => store.setToken('notAJwt');
    throws.should.throw(Error);
  });
  it('should get token', () => {
    store.setToken(token);
    store.getToken().should.be.equal(token);
  });
  it('should get token from cookie store', () => {
    store.setToken(token);
    store.token = undefined;
    store.getToken().should.be.equal(token);
    store.token.should.be.equal(token);
  });
  it('should return true on has token', () => {
    store.setToken(token);
    store.hasToken().should.be.equal(true);
  });
  it('should return false on has token', () => {
    store.deleteToken();
    store.hasToken().should.be.equal(false);
  });
  it('should delete token', () => {
    store.setToken(token);
    store.deleteToken();
    should.not.exist(cookie.get('testToken'));
    should.not.exist(store.token);
  });
});
