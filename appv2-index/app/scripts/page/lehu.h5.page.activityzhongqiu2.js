define('lehu.h5.page.activityzhongqiu2', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.hybrid',

        'lehu.h5.header.footer',

        'lehu.h5.component.activityzhongqiu2'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid,
        LHFooter,
        LHActivityzhongqiu2) {
        'use strict';

        Fastclick.attach(document.body);

        var List = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                var activityzhongqiu = new LHActivityzhongqiu2("#activityzhongqiu2");
                new LHFooter();
            }
        });

        new List('#activityzhongqiu2');
    });