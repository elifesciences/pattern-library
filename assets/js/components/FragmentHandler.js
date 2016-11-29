'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class FragmentHandler {

  static isSingleton()  {
    return true;
  }

  constructor($elm, _window = window, doc = document) {

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.window.addEventListener('DOMContentLoaded', this.handleDomLoad.bind(this));

  }

  // detect fragment on page load or hash change
  // determine whether the fragment belongs to (incl. within) a collapsed section
  // if so, emit a section open event with the id of the section to open
  // this can be listened for by the article section component

  handleDomLoad(e) {
    this.handleSectionOpeningViaHash(e);
    this.window.removeEventListener('DOMContentLoaded', this.handleDomLoad.bind(this));
    this.window.addEventListener('hashchange', this.handleSectionOpeningViaHash.bind(this));
  }

  isIdOfOrWithinSection(id, $section, doc, areElementsNested) {
    if (id === $section.id) {
      return true;
    }

    let $fragWithId = doc.querySelector('#' + id);
    return areElementsNested($section, $fragWithId);
  }

  getIdOfCollapsedSection(hash, doc, areElementsNested) {
    let collapsedSections = doc.querySelector('.article-section--collapsed');
    if (!collapsedSections) {
      return null;
    }

    let $collapsedSectionContainingFrag;
    [].forEach.call(collapsedSections, ($collapsedSection) => {
      if (!$collapsedSectionContainingFrag) {
        if (this.isIdOfOrWithinSection(hash, $collapsedSection, doc, areElementsNested)) {
          $collapsedSectionContainingFrag = $collapsedSection;
        }
      }
    });

    if (!!$collapsedSectionContainingFrag) {
      return $collapsedSectionContainingFrag.id;
    }

    return null;
  }

  handleSectionOpeningViaHash(e) {

    // DEBUG
    this.window.addEventListener('expandSection', function (e) {
      console.log('caught expandSection event: ', e);
    });

    // TODO: Code similar to that in Audioplayer.seekNewTime(), consider refactoring out into common
    let hash = '';

    // event was hashChange
    if (!!e.newURL) {
      hash = e.newURL.substring(e.newURL.indexOf('#') + 1);
    } else {
      hash = this.window.location.hash.substring(1);
    }

    if (!hash) {
      return false;
    }

    let idOfCollapsedSection = this.getIdOfCollapsedSection(hash, this.doc,
                                                            utils.areElementsNested);
    if (!!idOfCollapsedSection) {
      // emit a section open event with the id of the section to open
      let expandSection;
      try {
        expandSection = new CustomEvent('expandSection', { detail: this.idOfCollapsedSection });
      } catch (e) {
        // CustomEvent not supported, do it the old fashioned way
        expandSection = document.createEvent('expandSection');
        expandSection.initCustomEvent('expandSection', true, true, { detail: this.idOfCollapsedSection });
      }

      this.$elm.dispatchEvent(expandSection);

    }
  }
};
