'use strict';

const utils = require('../libs/elife-utils')();

/**
 * FragmentHandler mediates how the hash controls the opening of article sections.
 * It has no dedicated pattern template and its data-behaviour may live on any element, but note
 * that because it's a singleton only one will be instansiated.
 * @type {FragmentHandler}
 */
module.exports = class FragmentHandler {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.isSingleton = true;
    this.window.addEventListener('DOMContentLoaded', this.handleDomLoad.bind(this));
  }

  handleDomLoad(e) {
    this.handleSectionOpeningViaHash(e);
    this.window.addEventListener('hashchange', this.handleSectionOpeningViaHash.bind(this));
  }

  /**
   * Indicates whether an HTML element with a given id is found as/within a specific chunk of html
   *
   * @param {String} id The id  of the HTML element to search for
   * @param {HTMLElement} $section The element to search/search within
   * @param {HTMLDocument} doc
   * @param {Function} areElementsNested Handles determination of nesting
   * @returns {boolean} true if element with id is $section, or is contained within $section
   */
  isIdOfOrWithinSection(id, $section, doc, areElementsNested) {
    if (id === $section.id) {
      return true;
    }

    let $fragWithId = doc.querySelector('#' + id);
    return areElementsNested($section, $fragWithId);
  }

  /**
   * Returns the id of the collapsed section containing the html element with idToFind, or null.
   *
   * @param {String} idToFind The id to search for
   * @param {HTMLDocument} doc
   * @param {Function} areElementsNested Handles determination of nesting
   * @returns {String} The id of the collapsed section containing idToFind, or null
   */
  getIdOfCollapsedSection(idToFind, doc, areElementsNested) {
    let collapsedSections = doc.querySelectorAll('.article-section--collapsed');
    if (!collapsedSections) {
      return null;
    }

    let $collapsedSectionContainingFrag;
    [].forEach.call(collapsedSections, ($collapsedSection) => {
      if (!$collapsedSectionContainingFrag) {
        if (this.isIdOfOrWithinSection(idToFind, $collapsedSection, doc, areElementsNested)) {
          $collapsedSectionContainingFrag = $collapsedSection;
        }
      }
    });

    if (!!$collapsedSectionContainingFrag) {
      return $collapsedSectionContainingFrag.id;
    }

    return null;
  }

  /**
   * Fires a custom expandsection event on the collapsed article section containing id from hash.
   *
   * @param e
   * @returns {boolean} False if no hash found
   */
  handleSectionOpeningViaHash(e) {

    // TODO: Code similar to that in Audioplayer.seekNewTime(), refactor out into common
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
      // TODO: Used in several places, refactor out into common
      let expandSection;
      try {
        expandSection = new CustomEvent('expandsection', { detail: hash });
      } catch (e) {
        // CustomEvent not supported, do it the old fashioned way
        expandSection = document.createEvent('expandsection');
        expandSection.initCustomEvent('expandsection', true, true, { detail: hash });
      }

      this.doc.querySelector('#' + idOfCollapsedSection).dispatchEvent(expandSection);

    }
  }
};
