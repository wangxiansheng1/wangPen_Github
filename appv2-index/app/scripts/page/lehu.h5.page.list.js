define(
    'lehu.mall.page.list', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.env.switcher',
        'lehu.hybrid',

        'lehu.h5.component.list'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHHeader, LHConfig, LHSwitcher, LHHybrid,
        LHList) {
        'use strict';

        Fastclick.attach(document.body);

        var List = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                if (!LHFrameworkComm.prototype.checkUserLogin.call(this)) {
                    window.location.href = LHConfig.setting.link.login + '&from=' + escape(window.location.pathname);
                    return false;
                }
            }
        });

        new List('#list');
    });