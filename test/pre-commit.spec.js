const execSync = require('child_process').execSync;

const { expect } = require('chai');
const { setup, teardown, SAMPLE_REPO_LOCATION } = require('./_utils');

describe('pre-commit', () => {
  afterEach(teardown);

  it('should fail when the hook fails', () => {
    setup({
      'githook:pre-commit': 'exit 1',
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

  it('should succeed when the hook succeeds', () => {
    const commitMsgExpected = 'testing pre-commit';
    let commitMsgActual = 'did not get set';

    setup({
      'githook:pre-commit': 'exit 0',
    });

    execSync(
      'git add sample-file.txt',
      { cwd: SAMPLE_REPO_LOCATION }
    );

    commitMsgActual = execSync(
      `git commit -m "${commitMsgExpected}"`,
      { cwd: SAMPLE_REPO_LOCATION }
    )
      .toString()
      .trim();

    expect(commitMsgActual).to.contain(commitMsgExpected);
  });

  xdescribe('running `npm test`', () => {
    before(() => {
      setup({
        'githook:pre-commit': 'npm run test',
        // test: 'echo "Error: no test specified" && exit 1'
      });
    });
  });
});
