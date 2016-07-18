define('lehu.mall.page.index', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.env.switcher',
        'lehu.hybrid',

        'lehu.h5.component.index'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHHeader, LHConfig, LHSwitcher, LHHybrid,
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
                if (!LHFrameworkComm.prototype.checkUserLogin.call(this)) {
                    window.location.href = LHConfig.setting.link.login + '&from=' + escape(window.location.pathname);
                    return false;
                }
            }
        });

        new Index('#index');
    });