var utils = require('./_utils.js');

var chai = require('chai');
var expect = chai.expect;

describe('no valid hook scripts', function () {
  afterEach(utils.teardown);

  it('should warn that no hooks were valid', function () {
    var logLines = utils.setup({ 'githook:not-a-valid-hook': 'exit 1' });
    expect(logLines).to.have.length(3);
    expect(logLines[0]).to.equal('githook-scripts: "not-a-valid-hook" is not a valid git hook, ignoring');
  });

  it('should say what valid hooks are and how to activate them when added', function () {
    var logLines = utils.setup({ 'githook:not-a-valid-hook': 'exit 1' });
    expect(logLines).to.have.length(3);
    expect(logLines[1]).to.equal('githook-scripts: no valid githook scripts found, add one (ex: "githook:pre-commit") to package.json and run "npm rebuild githook-scripts" to activate');
    expect(logLines[2]).to.equal('githook-scripts: valid githooks are applypatch-msg, pre-applypatch, post-applypatch, pre-commit, prepare-commit-msg, commit-msg, post-commit, pre-rebase, post-checkout, post-merge, pre-receive, update, post-receive, post-update, pre-auto-gc, post-rewrite, pre-push');
  });

  it('should warn if a package.json does not have any githook scripts defined', function () {
    var logLines = utils.setup({ test: 'jest' });
    expect(logLines).to.have.length(1);
    expect(logLines[0]).to.equal('githook-scripts: no githook scripts found, add one (ex: "githook:pre-commit") to package.json and run "npm rebuild githook-scripts" to activate');
  });
});
