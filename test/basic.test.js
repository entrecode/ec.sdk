'use stict';

const chai = require('chai');

describe('basic test of testing framework', () => {
  it('javascript should still be crazy', () => {
    ([] + []).should.be.equal('');
  });
});
