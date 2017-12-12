var utils = require('./_utils.js');

var chai = require('chai');
var chaiFiles = require('chai-files');
var expect = chai.expect;

chai.use(chaiFiles);

describe('no scripts', function () {
  after(utils.teardown);

  it('should not fail if a package.json does not have a scripts field', function () {
    expect(function () { utils.setup(undefined); }).not.to.throw();
  });
});
