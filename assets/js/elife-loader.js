(function (window) {
  'use strict';

  function browserHasMinimumFeatureSupport () {
    return (
      !!window.localStorage &&
      !!(window.document.createElement('div')).dataset &&
      typeof window.document.querySelector === 'function' &&
      typeof window.addEventListener === 'function'
    );
  }

  function isNetworkInformationAvailable() {
    return navigator.connection && typeof navigator.connection.effectiveType === 'string';
  }

  function networkIsDefinitelySlow () {
    if (isNetworkInformationAvailable()) {
      if (navigator.connection.effectiveType.indexOf('2g') > -1) {
        console.log('no');
        return true;
      } else {
        console.log('yes');
        return false;
      } 
    } else {
      console.log('who knows');
      return false;
    }
  }

  try {
    var scriptPaths,
        $body;
    if (browserHasMinimumFeatureSupport() && !networkIsDefinitelySlow()) {
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
    if (typeof window.newrelic === 'object') {
      window.newrelic.noticeError(e);
    } else {
      window.console.error('JavaScript loading failed with the error: "' + e +
      '". Additionally, RUM logging failed.');
    }
  }

}(window));
