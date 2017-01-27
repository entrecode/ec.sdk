/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const emitter = require('../lib/EventEmitter').default;

const should = chai.should();
chai.use(sinonChai);

describe('Event Emitter', () => {
  let spy;
  beforeEach(() => {
    spy = sinon.spy();
  });
  afterEach(() => {
    spy = null;
    emitter.removeAllListeners('test');
  });
  it('should add one listener', () => {
    emitter.on('test', spy);
    emitter.listeners.get('test').length.should.be.equal(1);
  });
  it('should add two listeners', () => {
    emitter.on('test', spy);
    emitter.on('test', spy);
    emitter.listeners.get('test').length.should.be.equal(2);
  });
  it('should call spy', () => {
    emitter.on('test', spy);
    emitter.emit('test', 'hello');
    spy.should.have.been.called.once;
  });
  it('should remove listener', () => {
    emitter.on('test', spy);
    emitter.removeListener('test', spy).should.be.true;
    emitter.listeners.get('test').length.should.be.equal(0);
  });
  it('should not remove listener', () => {
    emitter.on('test', () => false);
    emitter.removeListener('test', spy).should.be.false;
    emitter.listeners.get('test').length.should.be.equal(1);
  });
  it('should remove nothing on unknown label', () => {
    should.not.exist(emitter.listeners.get('test'));
    emitter.removeListener('test', () => false);
    should.not.exist(emitter.listeners.get('test'));
  });
  it('should remove listener on true return', () => {
    emitter.on('test', () => true);
    emitter.listeners.get('test').length.should.be.equal(1);
    emitter.emit('test');
    emitter.listeners.get('test').length.should.be.equal(0);
  });
  it('should emit even on no registered', () => {
    emitter.emit('test').should.be.false;
  });
});
