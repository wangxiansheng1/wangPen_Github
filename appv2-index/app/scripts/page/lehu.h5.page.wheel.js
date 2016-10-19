define('lehu.h5.page.wheel', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.hybrid',

        'lehu.h5.header.footer',

        'lehu.h5.component.wheel'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid,
        LHFooter,
        LHWheel) {
        'use strict';

        Fastclick.attach(document.body);

        var Wheel = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                var wheel = new LHWheel("#content");
                new LHFooter();
            }
        });

        new Wheel('#content');
    });