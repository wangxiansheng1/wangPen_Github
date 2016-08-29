define('lehu.h5.header.header', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',

    'text!template_components_comment'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload,
    template_components_comment) {
    'use strict';

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {

      }
    });

  });