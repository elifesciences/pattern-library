module.exports = () => {
  'use strict';

  const $root = document.createElement('div');
  $root.classList.add('root');

  let $abstract = document.createElement('div');
  $abstract.setAttribute('id', 'abstract');
  $root.appendChild($abstract);

  let $followsAbstract = document.createElement('div');
  $followsAbstract.setAttribute('id', 'nextFollowingElementSiblingAfterAbstract');
  $root.appendChild($followsAbstract);

  let $disantFromAbstract = document.createElement('div');
  $disantFromAbstract.setAttribute('id', 'disantFromAbstract');
  $root.appendChild($disantFromAbstract);

  return $root;

};
