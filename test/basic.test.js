const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

describe('basic test of testing framework', () => {
  it('javascript should still be crazy', () => {
    ([] + []).should.be.equal('');
  });
});
