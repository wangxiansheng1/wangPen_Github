define('lehu.h5.component.activityzhongqiu', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'underscore',

    'imagelazyload',

    'text!template_components_activityzhongqiu'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, _,
    imagelazyload,
    template_components_activityzhongqiu) {
    'use strict';

    var userId = null;

    return can.Control.extend({

      helpers: {

      },

      init: function() {

        var renderFn = can.view.mustache(template_components_activityzhongqiu);
        var html = renderFn(this.options.data, this.helpers);
        this.element.html(html);

        window.onPageShow = function() {
          if (native.platfrom === "android") {
            userId = JSInterface.getUserId();
          }
        }

        window.onPageHide = function() {

        }
      },

      getCoupon: function(userId) {
        var param = {};

        if (userId) {
          alert("领券");
        } else {
          var no_login_fun = {
            'funName': 'no_login_fun',
            'params': {}
          };
          LHHybrid.nativeFun(no_login_fun);
        }
      },

      '.nindex_fanhui click': function() {
        var that = this;
        LHHybrid.getUserId()
          .done(function(id) {
            that.getCoupon(id);
          })
          .fail(function(error) {
            console.log(error);
          });
      }

    });
  });