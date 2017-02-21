/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const resolver = require('./mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../lib/helper');
const Session = require('../lib/Session').default;

chai.should();
chai.use(sinonChai);

describe('Session class', () => {
  it('should instantiate', () => {
    new Session('live').should.be.instanceOf(Session);
  });
  it('should instantiate with empty environment', () => {
    new Session().should.be.instanceOf(Session);
  });
  it('should throw error on invalid environment', () => {
    const fn = () => {
      /* eslint no-new:0 */
      new Session('invalid');
    };
    fn.should.throw(Error);
  });
  it('should set clientID', () => {
    const sessioin = new Session();
    sessioin.should.not.have.property('clientID');
    sessioin.setClientID('rest');
    sessioin.tokenStore.getClientID().should.be.equal('rest');
  });
  it('should throw on undefined clientID', () => {
    const throws = () => new Session().setClientID();
    throws.should.throw(Error);
  });
  it('should throw on not rest clientID', () => {
    const throws = () => new Session().setClientID('notrest');
    throws.should.throw(Error);
  });
  it('should login successfully', () => {
    const session = new Session();
    const stub = sinon.stub(helper, 'post');
    stub.returns(resolver('login-token.json'));

    session.setClientID('rest');
    return session.login('andre@entrecode.de', 'mysecret').should.eventually.be.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should reject when already logged in', () => {
    const session = new Session();
    session.tokenStore.set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    session.setClientID('rest');

    return new Session().login('user', 'mysecret').should.be.rejectedWith('already logged in or old token present. logout first');
  });
  it('should be rejected on unset clientID', () => {
    const session = new Session();
    session.tokenStore.del();
    session.tokenStore.clientID = undefined;
    return session.login('user', 'mysecret').should.be.rejectedWith('clientID must be set with Account#setClientID');
  });
  it('should be rejected on undefined email', () => {
    const session = new Session();
    session.tokenStore.del();
    session.setClientID('rest');
    return session.login(null, 'mysecret').should.be.rejectedWith('email must be defined');
  });
  it('should be rejected on undefined password', () => {
    const session = new Session();
    session.tokenStore.del();
    session.setClientID('rest');
    return session.setClientID('rest').login('user', null).should.be.rejectedWith('password must be defined');
  });
  it('should logout successfully', () => {
    const session = new Session();
    session.setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    const stub = sinon.stub(helper, 'post');
    stub.returns(Promise.resolve());

    return session.logout().should.be.eventually.fulfilled
    .and.notify(() => stub.restore());
  });
  it('should be successful on no token', () => {
    const session = new Session();
    return session.logout().should.be.eventually.fullfilled;
  });
  it('should be rejected on unset clientID', () => {
    const session = new Session();
    session.tokenStore.set('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRyZWNvZGVUZXN0IiwiaWF0IjoxNDg1NzgzNTg4LCJleHAiOjQ2NDE0NTcxODgsImF1ZCI6IlRlc3QiLCJzdWIiOiJ0ZXN0QGVudHJlY29kZS5kZSJ9.Vhrq5GR2hNz-RoAhdlnIIWHelPciBPCemEa74s7cXn8');
    session.tokenStore.clientID = undefined;
    return session.logout().should.be.rejectedWith('clientID must be set with Account#setClientID');
  });
});
