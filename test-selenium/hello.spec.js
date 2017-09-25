let chai = require('chai');
let expect = chai.expect;

describe('webdriver.io page', function() {
  it('should have the right title', function () {
    browser.url('/patterns/00-atoms-components-button/00-atoms-components-button.html');
    var title = browser.getTitle();
    expect(title).to.equal('Pattern sample');
  });
});
