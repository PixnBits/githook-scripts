const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

const debug = require('debug')('githook-scripts:postinstall');

const VALID_HOOK_NAMES = [
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
  'pre-push',
];

(function postinstall() {
  // we're in .../parent-module/node_modules/githook-scripts
  const parentModulePath = path.resolve(process.cwd(), '../../');
  let parentModulePackage;
  try {
    // justification in the catch statement
    parentModulePackage = require(path.join(parentModulePath, 'package.json')); // eslint-disable-line global-require
  } catch (err) {
    // not used as a dependency, development
    debug(err);
    console.warn('githook-scripts: aborting hook installation, no parent package detected');
    return;
  }

  const parentGitPath = exec(
    'git rev-parse --show-toplevel',
    { cwd: parentModulePath }
  )
    .toString()
    .trim();

  if (parentModulePackage.scripts && typeof parentModulePackage.scripts === 'object') {
    Object.keys(parentModulePackage.scripts)
      .forEach((scriptName) => {
        const scriptParts = /^githook:(.+)$/.exec(scriptName);
        if (!scriptParts) {
          debug(`${scriptName} ignored`);
          return;
        }

        const hookName = scriptParts[1];
        if (VALID_HOOK_NAMES.indexOf(hookName) === -1) {
          console.warn(`githook-scripts: "${hookName}" is not a valid git hook, ignoring`);
          return;
        }

        const hookPath = path.join(parentGitPath, '.git/hooks', hookName);
        fs.writeFileSync(hookPath, `#!/bin/bash\n npm run ${scriptName} "$@"`);
        fs.chmodSync(hookPath, '755');
        debug('wrote ', hookPath);
        console.log(`githook-scripts: added hook ${hookName}`);
      });
  } else {
    console.warn('githook-scripts: no "scripts" field in package.json, skipping');
  }
}());
