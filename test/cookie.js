var expect = chai.expect;

describe('hAzzle()', function () {

  it('hAzzle(...)', function () {
    expect(hAzzle).to.be.a('function');
  });

  it('hAzzle.version', function () {
    expect(hAzzle.version).to.be.a('string');
    expect(hAzzle.version).to.equal('1.0.1b');
  });

});
