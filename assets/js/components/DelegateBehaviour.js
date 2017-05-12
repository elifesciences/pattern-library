module.exports = class DelegateBehaviour {

  static setInitialiseComponent(initialiseComponent) {
    DelegateBehaviour.initialiseComponent = initialiseComponent;
  }

  constructor($elm) {
    const behaviour = $elm.getAttribute('data-delegate-behaviour');
    const targets = $elm.querySelectorAll($elm.getAttribute('data-selector'));
    [].forEach.call(targets, (target) =>
        DelegateBehaviour.initialiseComponent(target, behaviour)
    );
  }

};
