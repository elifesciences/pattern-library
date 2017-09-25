let chai = require('chai');
let expect = chai.expect;

describe('webdriver.io page', function() {
  it('should have the right title', function () {
    browser.url('/');
    var title = browser.getTitle();
    expect(title).to.equal('Pattern Lab');
  });
});
