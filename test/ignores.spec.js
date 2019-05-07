const path = require('path');

const chai = require('chai');
const chaiFiles = require('chai-files');

const { setup, teardown, SAMPLE_REPO_LOCATION } = require('./_utils');

chai.use(chaiFiles);
const { expect } = chai;
const { file } = chaiFiles;

describe('ignores', () => {
  after(teardown);

  it('should not add a hook file for non-hooks', () => {
    const qwertyPath = path.join(SAMPLE_REPO_LOCATION, '.git', 'hooks', 'qwerty');

    setup({
      'githook:qwerty': 'node -e "console.log(\'qwerty\');"',
    });

    expect(file(qwertyPath)).to.not.exist;
  });
});
