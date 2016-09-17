define('lehu.h5.component.coupon', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',
    'lehu.utils.busizutil',

    'text!template_components_coupon'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload, busizutil,
    template_components_coupon) {
    'use strict';

    // 优惠券类型：未领取0 未使用1
    var COUPON_UNGET = "0";
    var COUPON_UNUSED = "1";

    return can.Control.extend({

      param: {},

      helpers: {
        'getDay': function(time, img) {
          if (_.isFunction(time)) {
            time = time();
          }

          return time.substring(0, 10);
        }
      },

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();

        this.userId = busizutil.getUserId();
        if (!this.userId) {
          location.href = "login.html?from=coupon.html"
        }

        this.render();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      render: function() {
        var that = this;

        this.param = {
          "userId": this.userId,
          "flag": COUPON_UNGET,
          "pageindex": "1",
          "pagesize": "20"
        };

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL + LHConfig.setting.action.appMyCoupon,
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            that.options.data = data.couponList;

            var renderList = can.mustache(template_components_coupon);
            var html = renderList(that.options, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {
            console.log(error);
          });
      },

      getCoupon: function(userId, acitveId) {
        var that = this;

        this.param = {
          "userId": userId,
          "acitveId": acitveId
        };

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL + LHConfig.setting.action.getLHTicket,
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            util.tip(data.msg);
          })
          .fail(function(error) {
            util.tip(error.msg);
          });
      },

      ".coupons_box_r click": function(element, event) {
        var couponid = element.attr("data-id");
        this.getCoupon(this.userId, couponid);
      },

      '.nindex_fanhui click': function() {

        var jsonParams = {
          'funName': 'back_fun',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
        console.log('back_fun');

      }
    });

  });