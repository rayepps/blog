

(function() {

  /**
   * Created by ray krow on 1/17/17.
   */
  'use strict';

  var mobimen = {

      mobileMenuIconEl: null,
      bodyEl: null,
      menuEl: null,
      menuActiveClass: 'rb-show-mobile-menu',
      menuIconAnimationClass: 'rb-animate-menu',
      hasBeenInit: false,

      init: function() {

          console.warn('mobimen ready');

          mobimen.mobileMenuIconEl = document.getElementById('mobile-menu-icon');
          mobimen.menuEl = document.getElementById('mobile-menu');
          mobimen.bodyEl = document.getElementsByTagName('body')[0];

          window.mobimen = mobimen;

      },

      click: function() {

          if (!window.mobimen) mobimen.init();

          window.mobimen.onMenuClick();

      },


      onMenuClick: function(e) {

          var menuIsVisible = mobimen.hasClass(mobimen.bodyEl, mobimen.menuActiveClass);

          if (menuIsVisible) {
              // Its visible, hide it
              mobimen.showHideBodyElems({show:true});
              mobimen.menuEl.style.height = '0px';
          } else {
              // Its hidden, show it
              var menuHeight = window.innerHeight - mobimen.menuEl.offsetTop;
              mobimen.removeClass(mobimen.menuEl, 'collapse');
              mobimen.menuEl.style.height = menuHeight + 'px';
              window.setTimeout(function() {
                  mobimen.showHideBodyElems({show:false});
              }, 505); // CSS animation to change height takes 500ms, so 5ms after the menu is shown, we hide the page conents to lock scroll
          }

          mobimen.toggleClass(mobimen.bodyEl, mobimen.menuActiveClass);

          mobimen.addClass(mobimen.bodyEl, mobimen.menuIconAnimationClass);
          window.setTimeout(function() {
              mobimen.removeClass(mobimen.bodyEl, mobimen.menuIconAnimationClass);
          }, 253);

      },

      showHideBodyElems: function(config) { // config = {show: true || false}

          var children = mobimen.bodyEl.children,
              show = config.show;

          for (var i = 0; i < children.length; i++) {
              var child = children[i];
              if ('header script'.includes(child.nodeName.toLowerCase())) continue;
              if (show) {
                  mobimen.removeClass(child, 'hidden');
              } else {
                  mobimen.addClass(child, 'hidden');
              }
          }

      },

      addClass: function(el, className) {
          if (el.className.includes(className)) return;
          el.className += ' ' + className;
      },

      removeClass: function(el, className) {
          if (!el.className.includes(className)) return;
          el.className = el.className.replace(className, '');
      },

      toggleClass: function(el, className) {
          if (mobimen.hasClass(el, className)) {
              mobimen.removeClass(el, className);
          } else {
              mobimen.addClass(el, className);
          }
      },

      hasClass: function(el, classNameToCheck) {
          var className = ' ' + classNameToCheck + ' ';
          return ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1 );
      }

  };

  mobimen.click();

})();
