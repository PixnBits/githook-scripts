var utils = require('./_utils.js');

var chai = require('chai');
var chaiFiles = require('chai-files');
var expect = chai.expect;

chai.use(chaiFiles);

describe('git', function () {
  after(utils.teardown);

  it('should not fail if git is not available', function () {
    var scripts = {
      'githook:pre-commit': 'exit 0'
    };
    expect(function () { utils.setup(scripts, { disableGit: true }); }).not.to.throw();
  });
});
