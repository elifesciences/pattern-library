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

    this.window.addEventListener('load', this.handleSectionOpeningViaHash.bind(this));
    this.window.addEventListener('hashchange', this.handleSectionOpeningViaHash.bind(this));
  }

  /**
   * Returns the id of the collapsed section containing the html element with idToFind, or null.
   *
   * @param {String} idToFind The id to search for
   * @param {HTMLDocument} doc
   * @returns {String} The id of the collapsed section containing idToFind, or null
   */
  getIdOfCollapsedSection(idToFind, doc) {
    let collapsedSections = doc.querySelectorAll('.article-section--collapsed');
    if (!collapsedSections.length) {
      return null;
    }

    let $collapsedSectionContainingFrag;
    [].forEach.call(collapsedSections, ($collapsedSection) => {
      if (!$collapsedSectionContainingFrag) {
        if (utils.isIdOfOrWithinSection(idToFind, $collapsedSection, doc)) {
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

    let idOfCollapsedSection = this.getIdOfCollapsedSection(hash, this.doc);
    if (!!idOfCollapsedSection) {
      this.doc.getElementById(idOfCollapsedSection).dispatchEvent(utils.eventCreator('expandsection', hash));
    }

    if (hash === 'annotations' || hash.indexOf('annotations:') === 0) {
      const sections = [].slice.call(this.doc.querySelectorAll('.article-section--js'));
      sections.forEach(($section) => {
        $section.dispatchEvent(utils.eventCreator('expandsection'));
      });
    }
  }
};
