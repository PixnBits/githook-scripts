var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;

var debug = require('debug')('githook-scripts:test-utils');
var rimraf = require('rimraf');

var SAMPLE_REPO_LOCATION = path.join(__dirname, 'test-repo');
var BROKEN_GIT_LOCATION = path.join(__dirname, 'broken-git');

module.exports.SAMPLE_REPO_LOCATION = SAMPLE_REPO_LOCATION;

function teardown() {
  // avoid confusing git, or us
  rimraf.sync(path.join(SAMPLE_REPO_LOCATION, '.git'));
  // reset to base state, as stored by git
  debug('clean: ' + execSync('git clean -fdx "' + SAMPLE_REPO_LOCATION + '"').toString());
  debug('checkout: ' + execSync('git checkout -- "' + SAMPLE_REPO_LOCATION + '"').toString());

  debug('teardown finished');
}
module.exports.teardown = teardown;

function setPackageScripts(scripts) {
  var pkgPath = path.join(SAMPLE_REPO_LOCATION, 'package.json');

  if (typeof scripts !== 'object' && scripts !== undefined) {
    throw new Error('setPackageScripts requires an object or undefined');
  }

  var pkg = JSON.parse(fs.readFileSync(pkgPath));
  pkg.scripts = scripts;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

function setup(scripts, opts) {
  // ensure no previous artifacts remain
  teardown();

  setPackageScripts(scripts);

  // make it a git repo
  debug('git init: ' + execSync('git init', { cwd: SAMPLE_REPO_LOCATION }).toString());
  if (opts && opts.afterGitInit) {
    opts.afterGitInit();
  }

  // install deps
  var npmExecOpts = { cwd: SAMPLE_REPO_LOCATION };
  if (opts && opts.disableGit) {
    npmExecOpts.env = Object.assign(
      {},
      process.env,
      { PATH: BROKEN_GIT_LOCATION + (process.platform === 'win32' ? ';' : ':') + process.env.PATH }
    );
  }
  debug('npm install: ' + execSync('npm --loglevel=silent install', npmExecOpts).toString());

  debug('setup finished');
}
module.exports.setup = setup;
