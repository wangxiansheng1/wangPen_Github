define('lehu.h5.page.404', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.hybrid'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid) {
        'use strict';

        Fastclick.attach(document.body);

        var List = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                var list = new LHList("#list");
            }
        });

        new List('#list');
    });