/**
 * Created by raykrow on 1/17/17.
 */
'use strict';

let krow = {

    $mobileMenuIcon: null,
    $body: null,
    $menu: null,
    menuActiveClass: 'rb-show-mobile-menu',


    init: function() {

        this.$mobileMenuIcon = $('#mobile-menu-icon');
        this.$body = $('body');
        this.$menu = $('#mobile-menu');

        // Apply click listener to mobile menu icon
        this.$mobileMenuIcon.click(this.onMenuClick);

    },

    onMenuClick: function(e) {

        let menuIsVisible = krow.$body.hasClass(krow.menuActiveClass);

        if (menuIsVisible) {
            krow.showAll(krow.$getBodyElems());
            krow.$menu.css('height', 0);
        } else {
            let ulHeight = window.innerHeight - krow.$menu.offset().top;
            krow.$menu.css('height', ulHeight);
            window.setTimeout(function() {
                krow.hideAll(krow.$getBodyElems());
            }, 505);
        }

        krow.$body.toggleClass(krow.menuActiveClass);

    },

    $getBodyElems: function() {
        return this.$body.children().not('script, header');
    },

    hideAll: function($elems) {
        $elems.each(function(i, elem) {
            $(elem).hide();
        })
    },

    showAll: function($elems) {
        $elems.each(function(i, elem) {
            $(elem).show();
        })
    }

};

krow.init();