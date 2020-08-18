'use strict';

const utils = require('../libs/elife-utils')();

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
      this.window.console.error(e);
      if (typeof this.window.newrelic === 'object') {
        this.window.newrelic.noticeError(e);
      }

      return;
    }

    this.$embedder = this.doc.createElement('script');
    this.$embedder.id = 'hypothesisEmbedder';
    this.$embedder.addEventListener('load', () => {
      this.setUpAssetViewerFocus(this.doc);
    });
    this.$embedder.addEventListener('error', () => {
      this.handleLoadError(this.$embedder);
    });
    this.doc.querySelector('head').appendChild(this.$embedder);
    this.$embedder.src = 'https://hypothes.is/embed.js';
  }

  setUpAssetViewerFocus(document) {
    document.addEventListener('scrolltorange', (event) => {
      if (!event.detail.startContainer) {
        return;
      }

      const $assetViewer = event.detail.startContainer.closest('.asset-viewer-inline');

      if ($assetViewer) {
        $assetViewer.dispatchEvent(utils.eventCreator('assetViewerFocus'));
      }
    });
  }

  handleLoadError($loader) {
    $loader.dataset.hypothesisEmbedLoadStatus = 'failed';
    $loader.dispatchEvent(new this.window.ErrorEvent('loaderror',
                                                       { message: 'Hypothesis embed load failed' }));
  }

  static assembleHypothesisConfig(window) {
    const externalConfig = window.elifeConfig.hypothesis;
    HypothesisLoader.validateConfig(externalConfig);

    const uiConfig = {
      branding: {
        accentColor: '#0288D1',
        appBackgroundColor: '#fff',
        ctaBackgroundColor: '#0288D1',
        ctaTextColor: '#fff',
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
      showHighlights: true,
      onLayoutChange: (layout) => {
        if (!!layout.expanded) {
          utils.expandCollapsedSections(document);
        }
      },
    };

    return function () {
      return Object.assign({}, uiConfig, externalConfig);
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
      throw new Error('Hypothesis config generation failed: couldn\'t find exactly one of the properties ' +
                                      '"onLoginRequest" and "onLogoutRequest"');
    }

    if (services.onLoginRequest && services.onProfileRequest) {
      throw new Error('Hypothesis config generation failed: found both mutually exclusive properties "onLoginRequest" ' +
                                      'and "onProfileRequest"');
    }

    if (services.onLoginRequest && !services.onSignupRequest) {
      HypothesisLoader.failValidationMissingProperty('onSignupRequest');
    }

    if (services.onLoginRequest && services.grantToken !== null) {
      throw new Error('Hypothesis config generation failed: expected the property "grantToken" to be null, but it was not null');
    }

    if (services.onLogoutRequest && !services.onProfileRequest) {
      HypothesisLoader.failValidationMissingProperty('onProfileRequest');
    }

    if (services.onLogoutRequest && services.onSignupRequest) {
      throw new Error('Hypothesis config generation failed: found both mutually exclusive properties "onLogoutRequest" ' +
                      'and "onSignupRequest"');
    }

    if (services.onLogoutRequest) {
      HypothesisLoader.validateAsPopulatedString('grantToken', services.grantToken);
    }

  }

  static validateAsUrl(name, value) {
    if (!HypothesisLoader.isProbablyUrl(value)) {
      HypothesisLoader.failValidationMissingProperty(name);
    }
  }

  static isProbablyUrl(candidate) {
    return typeof candidate === 'string' && candidate.match(/^https?:\/\/.*$/);
  }

  static validateAsPopulatedString(name, value) {
    if (typeof value !== 'string' || !value.length) {
      HypothesisLoader.failValidationMissingProperty(name);
    }
  }

  static failValidationMissingProperty(propertyName) {
    throw new Error(`Hypothesis config generation failed: couldn\'t find a valid property with the name "${propertyName}"`);
  }

};
