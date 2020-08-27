module.exports = () => {
  'use strict';

  const coreConfig = {
    branding: {
      accentColor: '#087acc',
      appBackgroundColor: 'white',
      ctaBackgroundColor: '#087acc',
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
        icon: 'https://elifesciences.org/assets/favicons/favicon.ee498e7d.svg',

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
        icon: 'http://localhost:8000/assets/favicons/favicon.ee498e7d.svg',

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
