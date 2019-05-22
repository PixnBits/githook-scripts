var utils = require('./_utils.js');

var chai = require('chai');
var chaiFiles = require('chai-files');
var expect = chai.expect;

chai.use(chaiFiles);

describe('no scripts', function () {
  afterEach(utils.teardown);

  it('should not fail if a package.json does not have a scripts field', function () {
    expect(function () { utils.setup(undefined); }).not.to.throw();
  });

  it('should warn if a package.json does not have a scripts field', function () {
    var logLines = utils.setup(undefined);
    expect(logLines).to.have.length(1);
    expect(logLines[0]).to.equal('githook-scripts: no "scripts" field in package.json, skipping');
  });

  it('should warn if a package.json does not have any scripts defined', function () {
    var logLines = utils.setup({ });
    expect(logLines).to.have.length(1);
    expect(logLines[0]).to.equal('githook-scripts: no githook scripts found, add one (ex: "githook:pre-commit") to package.json and run "npm rebuild githook-scripts" to activate');
  });
});
