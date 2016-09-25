var path = require('path');

var utils = require('./_utils.js');
var SAMPLE_REPO_LOCATION = utils.SAMPLE_REPO_LOCATION;

var chai = require('chai');
var chaiFiles = require('chai-files');
var expect = chai.expect;
var file = chaiFiles.file;

chai.use(chaiFiles);

describe('ignores', function () {
  after(utils.teardown);

  it('should not add a hook file for non-hooks', function () {
    var qwertyPath = path.join(SAMPLE_REPO_LOCATION, '.git', 'hooks', 'qwerty');

    utils.setup({
      'githook:qwerty': 'node -e "console.log(\'qwerty\');"'
    });

    expect(file(qwertyPath)).to.not.exist;
  });
});
