// The tests mutate the DOM such that this is fixture is moved, hence building it in JavaScript to easily reset it for each test.

/*
  <button class="speech-bubble speech-bubble--small" data-behaviour="SpeechBubble HypothesisOpener">
    <span aria-hidden="true">12</span>
    <span class="visuallyhidden">Open annotations (there are currently 12 annotations on this page).</span>
</button>

**/

const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = () => {
  'use strict';

  const $button = buildElement('button', ['button', 'speech-bubble']);
  $button.dataset.behaviour = 'SpeechBubble HypothesisOpener';
  $button.setAttribute('type', 'button');

  const $visual = buildElement('span', [], '12', $button);
  $visual.setAttribute('aria-hidden', true);
  buildElement('span', ['visuallyhidden'], 'Open annotations (there are currently 12 annotations on this page).', $button);

  const $count = buildElement('span', [], '', $button);
  $count.dataset.hypothesisAnnotationCount = '0';

  return $button;

};
