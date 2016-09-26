var assert = require('assert');
var exec = require('child_process').execSync;

var utils = require('./_utils.js');
var SAMPLE_REPO_LOCATION = utils.SAMPLE_REPO_LOCATION;

describe('commit-msg', function () {
  before(function () {
    utils.setup({
      'githook:commit-msg': 'node -e "console.log(process.argv);"'
    });
  });
  after(utils.teardown);

  it('should ', function () {
    var commitResult;

    exec(
      'git add sample-file.txt',
      { cwd: SAMPLE_REPO_LOCATION }
    );

    commitResult = exec(
      'git commit -m "testing commit-msg"',
      { cwd: SAMPLE_REPO_LOCATION }
    )
      .toString()
      .trim();

    assert.equal(commitResult, '');
  });
});
