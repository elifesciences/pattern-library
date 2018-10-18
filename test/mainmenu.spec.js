const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let MainMenu = require('../assets/js/components/MainMenu');

describe('A MainMenu Component', function () {
  'use strict';
  let $elm;
  let mainMenu;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="MainMenu"]');
    mainMenu = new MainMenu($elm);
    mainMenu.pageOverlay = {
      show: function () {

      },
      get$elm: function () {
        return {
          addEventListener: function () {

          }
        };
      }
    };
    spy(mainMenu.$elm, 'setAttribute');
  });

  afterEach(function () {
    mainMenu.$elm.setAttribute.restore();
  });


  it('exists', function () {
    expect(mainMenu).to.exist;
  });


  describe('The open method', function () {

    it('sets aria-expanded attribute to "true"', function () {
      mainMenu.open();
      expect(mainMenu.$elm.setAttribute.calledWithExactly('aria-expanded', 'true')).to.be.true;
    });

    it('adds the class "main-menu--shown"', function () {
      mainMenu.open();
      expect(mainMenu.$elm.classList.contains('main-menu--shown')).to.be.true;
    });

  });

  describe('The close method', function () {

    it('sets aria-expanded attribute to "false"', function () {
      //mainMenu.close();
      expect(mainMenu.$elm.setAttribute.calledWithExactly('aria-expanded', 'false')).to.be.false;
    });

    it('removes the class "main-menu--shown"', function () {
      mainMenu.$elm.classList.remove('main-menu--shown');
      expect(mainMenu.$elm.classList.contains('main-menu--shown')).to.be.false;
    });

  });

});
