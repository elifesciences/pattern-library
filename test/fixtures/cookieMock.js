"use strict";

const cookiesSet = new Set();

const mockCookies = () => {
  Object.defineProperty(document, 'cookie', {
    get: function () {
      return this.value || '';
    },
    set: function (cookie) {
      cookie = cookie || '';

      const cutoff = cookie.indexOf(';');
      const pair = cookie.substring(0, cutoff >= 0 ? cutoff : cookie.length);

      if (cookie === '' || cookiesSet.has(pair)) { //TODO check for empty string needed?
        cookiesSet.delete(pair);
      } else {
        cookiesSet.add(pair);
      }

      this.value = Array.from(cookiesSet).join('; ');

      return this.value;
    }
  });
};

const clearCookieMock = () => {
  cookiesSet.clear();
};

module.exports = {
  clearCookieMock: clearCookieMock,
  mockCookies: mockCookies,
};
