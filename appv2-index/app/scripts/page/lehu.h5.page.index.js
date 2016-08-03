define('lehu.h5.page.index', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.env.switcher',
        'lehu.hybrid',

        'lehu.h5.header.footer',

        'lehu.h5.component.index'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHSwitcher, LHHybrid,
        LHFooter,
        LHIndex) {
        'use strict';

        Fastclick.attach(document.body);

        var Index = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                var index = new LHIndex("#index");

                new LHFooter();
            }
        });

        new Index('#index');
    });