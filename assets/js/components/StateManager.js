'use strict';

module.exports = class StateManager {

  constructor(_window = window) {

    this.window = _window;
    this.thresholdWidth = 600;
    //this.$elm = $elm;

    this.init();
    //this.setState();

    this.state = null;
  }





  displayMobile() {
    console.log('Mobile');
  }

  displayDesktop() {
    console.log('Desktop');
  }

  resizeMobile() {
    console.log('Resize Mobile');
  }

  resizeDesktop() {
    console.log('Resize Desktop');
  }


  addEvent(object, type, callback) {

    if (object == null || typeof(object) == 'undefined') return;

    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
    } else {
      object["on"+type] = callback;
    }

  }

  setState() {

    console.log('StateManager.js - setState()');

    this.addEvent(window, "resize", function() {

      console.log('resized');


      var viewportWidth = this.window.innerWidth;

      if (viewportWidth < 600) {

        state = 'mobile';
        //console.log(state);
        this.displayMobile;

      } else {

        state = 'desktop';
        //console.log(state);
        this.displayDesktop;

      };

    });


  }

  resizePage() {
    this.setState;

    if (state === 'mobile') {
      this.resizeMobile;
    } else {
      this.resizeDesktop;
    }
  }


  init() {
    this.setState;

    this.addEvent(window, 'resize', this.resizePage);
  }


};
  // var displayMobile = function () {
  //   console.log("Mobile");
  // }
  // var displayDesktop = function () {
  //   console.log("Desktop");
  // }
