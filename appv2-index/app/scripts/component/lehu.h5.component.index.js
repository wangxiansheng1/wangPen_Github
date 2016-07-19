define('lehu.h5.component.index', [
    'zepto',
    'zepto.cookie',
    'can',
    'md5',
    'store',
    'fastclick',
    'lehu.h5.business.config',
    'lehu.h5.api',

    'text!template_components_index'
  ],

  function($, cookie, can, md5, store, Fastclick, LHConfig, LHAPI,
    template_components_index) {
    'use strict';

    return can.Control.extend({

      helpers: {

      },

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {

        var renderIndex = can.mustache(template_components_index);
        var html = renderIndex(this.options);
        this.element.html(html);

        var api = new LHAPI({
          url: "initIndex.do",
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