'use strict';

module.exports = (function () {

  const removeAllGeneratedHTMLFixtures = () => {

    [].forEach.call(
      document.querySelectorAll('[data-generated-fixture]'),
      function ($element) {
        $element.parentElement.removeChild($element);
      });

  };

  const getCookieNameRoot = () => {
    return 'fixture-cookie_';
  };

  const generateRandomId = () => {
    return `id-${Math.floor(Math.random() * 10000)}`;
  };

  const setFixtureCookie = function (id, value) {
    document.cookie = `${getCookieNameRoot()}${id}=${value}; expires=expires=Tue, 19 January 2038 03:14:07 UTC; path=/;`;
  };

  const clearCookie = (id) => {
    document.cookie = `${getCookieNameRoot()}${id}=true; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;
  };

  return {
    removeAllGeneratedHTMLFixtures,
    generateRandomId,
    getCookieNameRoot,
    setFixtureCookie,
    clearCookie,
  };

}());
