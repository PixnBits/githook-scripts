var path = require('path');
var fs = require('fs');
var exec = require('child_process').execSync;

var debug = require('debug')('githook-scripts:postinstall');

var VALID_HOOK_NAMES = [
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'post-checkout',
  'post-merge',
  'pre-receive',
  'update',
  'post-receive',
  'post-update',
  'pre-auto-gc',
  'post-rewrite',
  'pre-push'
];

// we're in .../parent-module/node_modules/githook-scripts
var parentModulePath = path.resolve(process.cwd(), '../../');
var parentModulePackage;
try {
  // justification in the catch statement
  parentModulePackage = require(path.join(parentModulePath, 'package.json')); // eslint-disable-line global-require
} catch (err) {
  // not used as a dependency, development
  debug(err);
  console.warn('githook-scripts: aborting hook installation, no parent package detected');
  return;
}

var parentGitPath;
try {
  parentGitPath = exec(
    'git rev-parse --show-toplevel',
    { cwd: parentModulePath }
  )
    .toString()
    .trim();
} catch (err) {
  // git may not be installed
  debug(err);
  console.warn('githook-scripts: unable to run git to find the top level, skipping');
  return;
}

if (!parentModulePackage.scripts || typeof parentModulePackage.scripts !== 'object') {
  console.warn('githook-scripts: no "scripts" field in package.json, skipping');
  return;
}

var gitHooksDirectoryPath = path.join(parentGitPath, '.git/hooks');
// `git init` can use templates that do not include a hooks directory
try {
  fs.statSync(gitHooksDirectoryPath);
} catch (gitHooksDirectoryPathDoesNotExistError) {
  fs.mkdirSync(gitHooksDirectoryPath);
}

if (!fs.statSync(gitHooksDirectoryPath).isDirectory()) {
  console.warn('githook-scripts: the .git/hooks path exists but is not a directory, unable to install hooks');
  return;
}

var githookNames = Object
  .keys(parentModulePackage.scripts)
  .map(function (scriptName) {
    var scriptParts = /^githook:(.+)$/.exec(scriptName);
    if (!scriptParts) {
      debug(scriptName + ' ignored');
      return false;
    }
    var hookName = scriptParts[1];
    return hookName;
  })
  .filter(function (hookName) {
    return !!hookName;
  });

if (githookNames.length <= 0) {
  console.warn('githook-scripts: no githook scripts found, add one (ex: "githook:pre-commit") to package.json and run "npm rebuild githook-scripts" to activate');
  return;
}

var validGithookNames = githookNames.filter(function (hookName) {
  if (VALID_HOOK_NAMES.indexOf(hookName) >= 0) {
    return true;
  }
  console.warn('githook-scripts: "' + hookName + '" is not a valid git hook, ignoring');
  return false;
});

if (validGithookNames.length <= 0) {
  console.warn('githook-scripts: no valid githook scripts found, add one (ex: "githook:pre-commit") to package.json and run "npm rebuild githook-scripts" to activate');
  console.warn('githook-scripts: valid githooks are ' + VALID_HOOK_NAMES.join(', '));
  return;
}

validGithookNames.forEach(function (hookName) {
  var hookPath = path.join(gitHooksDirectoryPath, hookName);
  var scriptName = 'githook:' + hookName;
  fs.writeFileSync(hookPath, '#!/bin/bash\n npm run ' + scriptName + ' "$@"');
  fs.chmodSync(hookPath, '755');
  debug('wrote ', hookPath);
  console.log('githook-scripts: added hook ' + hookName);
});
