var path = require('path');
var fs = require('fs');
var exec = require('child_process').execSync;

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
var parentModulePackage = require(path.join(parentModulePath, 'package.json'));

var parentGitPath = exec(
  'git rev-parse --show-toplevel',
  { cwd: parentModulePath }
)
  .toString()
  .trim();

console.log('--postinstall--');
// console.log(process.cwd());
// console.log('parentModulePath', parentModulePath);
// console.log('parentModulePackage.scripts', parentModulePackage.scripts);
// console.log('parentGitPath', parentGitPath);

Object.keys(parentModulePackage.scripts)
  .forEach(function (scriptName) {
    var scriptParts = /^githook:(.+)$/.exec(scriptName);
    if (!scriptParts) {
      console.info(scriptName + ' ignored');
      return;
    }

    var hookName = scriptParts[1];
    if (VALID_HOOK_NAMES.indexOf(hookName) === -1) {
      console.warn('githook-scripts: "' + hookName + '" is not a valid git hook, ignoring');
      return;
    }

    var hookPath = path.join(parentGitPath, '.git/hooks', hookName);
    fs.writeFileSync(hookPath, '#!/bin/bash\n npm run ' + scriptName + ' "$@"');
    fs.chmodSync(hookPath, '755');
    console.log('wrote ', hookPath);
  });

console.log('--postinstall--');
