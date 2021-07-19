
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

function networkIsDefinitelySlow (isNetworkInfoAvailable, connection) {
  if (!isNetworkInfoAvailable(connection)) {
    return false;
  }
  if (connection.effectiveType.indexOf('2g') > -1) {
    return true;
  }
  return false;
}

function init(config) {

  try {
    var scriptPaths = config.scriptPaths,
        $body;
    if (browserHasMinimumFeatureSupport() && !!networkIsDefinitelySlow(isNetworkInformationAvailable, navigator.connection)) {
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
}
init(window.elifeConfig || {});
