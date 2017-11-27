module.exports = () => {
  'use strict';

  const $root = document.createElement('div');
  $root.classList.add('wrapper--content');

  const $grid = document.createElement('div');
  $grid.classList.add('grid');
  $root.appendChild($grid);

  const $gridItem = document.createElement('div');
  $grid.classList.add('grid__item');
  $root.appendChild($gridItem);

  const sectionCount = 3;
  for(let i = 0; i < sectionCount; i += 1) {
    const $el = document.createElement('div');
    $gridItem.appendChild($el);
  }

  return $root;

};
