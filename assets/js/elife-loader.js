(function (window) {
  'use strict';

  try {
    var scriptPaths,
        $body;
    if (
      !!window.localStorage &&
      !!(window.document.createElement('div')).dataset &&
      typeof window.document.querySelector === 'function' &&
      typeof window.addEventListener === 'function'
    ) {
      scriptPaths = window.elifeConfig.scriptPaths;
      if (Array.isArray(scriptPaths) && scriptPaths.length) {
        $body = window.document.querySelector('body');
        scriptPaths.forEach(function (scriptPath) {
          var $script = window.document.createElement('script');
          $script.src = scriptPath;
          $body.appendChild($script);
        });
      }
    }


  } catch (e) {
    window.newrelic.noticeError(e);
  }

}(window));
