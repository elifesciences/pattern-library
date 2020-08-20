module.exports = () => {
  'use strict';

  const coreConfig = {
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
    showHighlights: true,
    usernameUrl: 'http://localhost/profiles/'
  };

  return {
    loggedOut: Object.assign({}, coreConfig, {
      services: [{
        apiUrl: 'https://hypothes.is/api/',
        authority: 'elifesciences.org',

        grantToken: null,
        onLoginRequest: function () {
          window.location.assign('/log-in');
        },

        onSignupRequest: function () {
          window.location.assign('/log-in');
        }
      }]
    }),

    loggedIn: Object.assign({}, coreConfig, {
      services: [{
        apiUrl: 'https://hypothes.is/api/',
        authority: 'test.elifesciences.org',

        grantToken: 'cyIsImlzcyI6ImEyMmNmMzI0LTkxNDUtMTFlNi04Y2I2LTI3ZX4yNjk0Mzc0',
        onLogoutRequest: function () {
          window.location.assign('/log-out');
        },

        onProfileRequest: function () {
          window.location.assign('/profiles/someperson');
        }
      }],
    })
  };
};
