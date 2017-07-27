module.exports = class DelegateBehaviour {

  static setInitialiseComponent(initialiseComponent) {
    DelegateBehaviour.initialiseComponent = initialiseComponent;
  }

  constructor($elm) {
    const behaviour = $elm.getAttribute('data-delegate-behaviour');
    const targets = $elm.querySelectorAll($elm.getAttribute('data-selector'));
    const classToApply = $elm.getAttribute('data-delegate-behaviour-class');
    [].forEach.call(targets, function (target) {
      DelegateBehaviour.initialiseComponent(target, behaviour);
      if (classToApply) {
        target.classList.add(classToApply);
      }
    });
  }

};
