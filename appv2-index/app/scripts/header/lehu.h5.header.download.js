define('lehu.h5.header.download', [
    'zepto',
    'can',
    'store',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',

    'text!template_header_download'
  ],

  function($, can, store, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload,
    template_header_download) {
    'use strict';

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function(element, options) {
        var renderDownload = can.mustache(template_header_download);
        var html = renderDownload(this.options);
        $("#download").html(html);

        var isHideAd = store.get('IS_HIDE_AD');
        if (isHideAd && (Date.now() - isHideAd > 1 * 24 * 60 * 60 * 1000)) {
          store.remove('IS_HIDE_AD');
        }

        if (this.options.position !== "bottom") {
          $('.downloadapp-content').css({
            'top': '0'
          });
        }

        if (isHideAd) {
          $('.downloadapp').hide();
        } else {
          $('.downloadapp').css({
            'display': 'block'
          });
        }

        $(".downloadapp-close").bind("click", function() {
          store.set("IS_HIDE_AD", Date.now());
          $(".downloadapp").hide()
        })
      }
    });

  });