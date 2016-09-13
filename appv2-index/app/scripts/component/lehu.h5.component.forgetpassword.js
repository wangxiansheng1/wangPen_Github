define('lehu.h5.component.forgetpassword', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',

    'text!template_components_forgetpassword'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload,
    template_components_forgetpassword) {
    'use strict';

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();

        var renderList = can.mustache(template_components_forgetpassword);
        var html = renderList(this.options);
        this.element.html(html);

        this.param = this.initParams();
        this.totalPageNum = "";
        this.goodsCategoryList();

        this.bindScroll();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      '.back click': function() {

        if (util.isMobile.Android() || util.isMobile.iOS()) {
          var jsonParams = {
            'funName': 'back_fun',
            'params': {}
          };
          LHHybrid.nativeFun(jsonParams);
          console.log('back_fun');
        } else {
          history.go(-1);
        }
      }
    });

  });