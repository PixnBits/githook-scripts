var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;

var debug = require('debug')('githook-scripts:test-utils');
var rimraf = require('rimraf');

var SAMPLE_REPO_LOCATION = path.join(__dirname, 'test-repo');

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

function setup(scripts) {
  // ensure no previous artifacts remain
  teardown();

  setPackageScripts(scripts);

  // make it a git repo
  execSync('git init', { cwd: SAMPLE_REPO_LOCATION });

  // install deps
  execSync('npm --loglevel=silent install', { cwd: SAMPLE_REPO_LOCATION });

  debug('setup finished');
}
module.exports.setup = setup;
