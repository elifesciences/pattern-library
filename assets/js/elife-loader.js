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

  function isNetworkInformationAvailable(connection) {
    return !!connection && typeof connection.effectiveType === 'string';
  }

  function networkIsDefinitelySlow () {
    if (!isNetworkInformationAvailable(navigator.connection)) {
      return false;
    }
    if (navigator.connection.effectiveType.indexOf('2g') > -1) {
      return true;
    }
    return false;
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
