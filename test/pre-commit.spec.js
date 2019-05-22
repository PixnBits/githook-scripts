var execSync = require('child_process').execSync;

var utils = require('./_utils.js');
var SAMPLE_REPO_LOCATION = utils.SAMPLE_REPO_LOCATION;

var chai = require('chai');
var expect = chai.expect;

describe('pre-commit', function () {
  afterEach(utils.teardown);

  it('should fail when the hook fails', function () {
    utils.setup({
      'githook:pre-commit': 'exit 1'
    });

    execSync(
      'git add sample-file.txt',
      { cwd: SAMPLE_REPO_LOCATION }
    );

    function commit() {
      execSync(
        'git commit -m "testing pre-commit"',
        { cwd: SAMPLE_REPO_LOCATION }
      );
    }

    expect(commit).to.throw;
  });

  it('should succeed when the hook succeeds', function () {
    var commitMsgExpected = 'testing pre-commit';
    var commitMsgActual = 'did not get set';

    utils.setup({
      'githook:pre-commit': 'exit 0'
    });

    execSync(
      'git add sample-file.txt',
      { cwd: SAMPLE_REPO_LOCATION }
    );

    commitMsgActual = execSync(
      'git commit -m "' + commitMsgExpected + '"',
      { cwd: SAMPLE_REPO_LOCATION }
    )
      .toString()
      .trim();

    expect(commitMsgActual).to.contain(commitMsgExpected);
  });

  xdescribe('running `npm test`', function () {
    before(function () {
      utils.setup({
        'githook:pre-commit': 'npm run test'
        // test: 'echo "Error: no test specified" && exit 1'
      });
    });
  });
});
