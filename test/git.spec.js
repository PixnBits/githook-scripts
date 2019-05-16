var fs = require('fs');
var path = require('path');

var utils = require('./_utils.js');
var SAMPLE_REPO_LOCATION = utils.SAMPLE_REPO_LOCATION;
var rimraf = require('rimraf');

var chai = require('chai');
var chaiFiles = require('chai-files');
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

chai.use(chaiFiles);

describe('git', function () {
  afterEach(utils.teardown);

  it('should not fail if git is not available', function () {
    var scripts = {
      'githook:pre-commit': 'exit 0'
    };
    expect(function () { utils.setup(scripts, { disableGit: true }); }).not.to.throw();
  });

  describe('.git/hooks', function () {
    it('gets created when not present', function () {
      var gitHooksDirectory = path.join(SAMPLE_REPO_LOCATION, '.git', 'hooks');

      utils.setup(
        { 'githook:pre-commit': 'exit 0' },
        { afterGitInit: function () { rimraf.sync(gitHooksDirectory); } }
      );

      expect(dir(gitHooksDirectory)).to.exist;
    });

    it('causes no hooks to be installed when not a directory', function () {
      var gitHooksDirectory = path.join(SAMPLE_REPO_LOCATION, '.git', 'hooks');

      utils.setup(
        { 'githook:pre-commit': 'exit 0' },
        { afterGitInit: function () {
          rimraf.sync(gitHooksDirectory);
          fs.writeFileSync(gitHooksDirectory, Buffer.from('content!'), 'utf8');
        } }
      );

      expect(file(gitHooksDirectory)).to.exist;
      expect(file(path.join(gitHooksDirectory, 'pre-commit'))).not.to.exist;
    });
  });
});
