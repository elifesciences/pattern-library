'use strict';

module.exports = class AllSubjectsListLink {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.doc = doc;
    this.$elm = $elm;

    this.targetFragmentId = this.$elm.href.substring(this.$elm.href.indexOf('#'));
    let $target = this.doc.querySelector(this.targetFragmentId);
    let $parent = this.$elm.parentNode;
    $parent.insertBefore($target, this.$elm);
    $parent.removeChild(this.$elm);
  }

};
