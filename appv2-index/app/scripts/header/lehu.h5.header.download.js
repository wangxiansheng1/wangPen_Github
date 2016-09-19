define('lehu.h5.header.download', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',

    'text!template_header_download'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload,
    template_header_download) {
    'use strict';

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        var renderDownload = can.mustache(template_header_download);
        var html = renderDownload(this.options);
        $("#download").html(html);
      }
    });

  });