'use strict';

module.exports = class HypothesisLoader {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.isSingleton = true;

    try {
      this.window.hypothesisConfig = HypothesisLoader.assembleHypothesisConfig(this.window);
    } catch (e) {
      console.error('Could\'t load Hypothesis config, aborting Hypothesis client loading.');
      console.error('The error was: ', e);
      return;
    }

    this.$embedder = this.doc.createElement('script');
    this.$embedder.src = 'https://hypothes.is/embed.js';
    this.$embedder.id = 'hypothesisEmbedder';
    this.$embedder.addEventListener('error', this.handleError);

    this.doc.querySelector('head').appendChild(this.$embedder);
  }

  handleError() {
    this.$elm.dataset.hypothesisEmbedLoadStatus = 'failed';
    this.$elm.dispatchEvent(new this.window.ErrorEvent(
      'loaderror',
      {
        message: 'Hypothesis embed load failed'
      }
    ));
  }

  static setHypothesisConfig(config, window) {
    window.hypothesisConfig = config;
  }

  static assembleHypothesisConfig(window) {
    const externalConfig = window.elifeConfig.hypothesis;
    HypothesisLoader.validateConfig(externalConfig);

    const uiConfig = {
      branding: {
        accentColor: '#0288D1',
        appBackgroundColor: 'white',
        ctaBackgroundColor: '#0288D1',
        ctaTextColor: 'white',
        selectionFontFamily: 'Georgia, Times, serif',
        annotationFontFamily: 'Georgia, Times, serif'
      },
      openSidebar: window.location.hash === '#annotations',
      disableToolbarCloseBtn: false,
      disableToolbarMinimizeBtn: true,
      disableToolbarHighlightsBtn: true,
      disableToolbarNewNoteBtn: true,
      disableBucketBar: true,
      enableSidebarDropShadow: true,
      enableExperimentalNewNoteButton: true,
      enableCleanOnboardingTheme: true,
      theme: 'clean',
      showHighlights: 'whenSidebarOpen'
    };

    return function () {
      return Object.assign(uiConfig, externalConfig);
    };
  }

  static validateConfig(externalConfig) {

    const services = externalConfig.services[0];

    HypothesisLoader.validateAsUrl('usernameUrl', externalConfig.usernameUrl);
    HypothesisLoader.validateAsUrl('apiUrl', services.apiUrl);
    HypothesisLoader.validateAsUrl('icon', services.icon);
    HypothesisLoader.validateAsPopulatedString('authority', services.authority);

    if ((services.onLoginRequest && services.onLogoutRequest) ||
        !(services.onLoginRequest || services.onLogoutRequest)) {
      throw new Error('Couldn\'t find exactly one of the properties ' +
                                      '"onLoginRequest" and "onLogoutRequest"');
    }

    if (services.onLoginRequest && services.onProfileRequest) {
      throw new Error('Found both mutually exclusive properties "onLoginRequest" ' +
                                      'and "onProfileRequest"');
    }

    if (services.onLoginRequest && services.grantToken !== null) {
      throw new Error('Expected the property "grantToken" to be null, but it wasn\'t');
    }

    if (services.onLogoutRequest && !services.onProfileRequest) {
      HypothesisLoader.failValidationMissingProperty('onProfileRequest');
    }

    if (services.onLogoutRequest) {
      HypothesisLoader.validateAsPopulatedString('grantToken', services.grantToken);
    }

  }

  static validateAsUrl(name, value) {
    if (!HypothesisLoader.isProbablyAUrl(value)) {
      HypothesisLoader.failValidationMissingProperty(name);
    }
  }

  static isProbablyAUrl(candidate) {
    return typeof candidate === 'string' && candidate.match(/^https?:\/\/.*$/);
  }

  static validateAsPopulatedString(name, value) {
    if (typeof value !== 'string' || !value.length) {
      HypothesisLoader.failValidationMissingProperty(name);
    }
  }

  static validateAsTruthy(candidates) {
    candidates.forEach((candidate) => {
      const name = Object.keys(candidate)[0];
      const value = candidate[name];
      if (!value) {
        HypothesisLoader.failValidationMissingProperty(name);
      }
    });
  }

  static failValidationMissingProperty(propertyName) {
    throw new Error(`Couldn\'t find a valid property with the name "${propertyName}"`);
  }

};
