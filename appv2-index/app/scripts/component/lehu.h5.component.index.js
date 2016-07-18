define('lehu.h5.component.index', [
    'zepto',
    'zepto.cookie',
    'can',
    'md5',
    'store',
    'fastclick',
    'lehu.h5.business.config',
    'lehu.h5.api'
  ],

  function($, cookie, can, md5, store, Fastclick, LHConfig, LHAPI) {
    'use strict';

    return can.Control.extend({

      helpers: {

      },

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        var api = new LHAPI({
          action: "initIndex.do",
          data: {}
        });
        api.sendRequest()
          .done(function(data) {
            console.dir(data);
          })
          .fail(function(error) {
            console.dir(error);
          })

      }
    });
  });