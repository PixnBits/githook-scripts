const chai = require('chai');
const chaiFiles = require('chai-files');

const { setup, teardown } = require('./_utils');

const { expect } = chai;
chai.use(chaiFiles);

describe('no scripts', () => {
  after(teardown);

  it('should not fail if a package.json does not have a scripts field', () => {
    expect(() => { setup(undefined); }).not.to.throw();
  });
});
