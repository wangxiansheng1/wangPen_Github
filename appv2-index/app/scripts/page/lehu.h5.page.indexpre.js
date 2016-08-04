define('lehu.h5.page.indexpre', [
        'swipe'
    ],

    function(Swipe) {
        'use strict';

        if (localStorage.html01) {
            $("#ajax_banner").html(localStorage.html01);

            new Swipe($('.nbanner .swiper-container')[0], {
                pagination: $('.swiper-pagination')[0],
                startSlide: 0,
                speed: 300,
                auto: 2000,
                continuous: true,
                disableScroll: false,
                stopPropagation: false,
                callback: function(index, elem) {

                },
                transitionEnd: function(index, elem) {}
            });
        }

        if (localStorage.html02) {
            $("#ajax_fastList").html(localStorage.html02);
        }

        if (localStorage.html03) {
            $("#ajax_hotRecommendation").html(localStorage.html03);
        }

        this.lazyload();
    });