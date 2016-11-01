define('lehu.h5.component.activityreward', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'md5',
    'store',

    'imagelazyload',
    'lehu.utils.busizutil',

    'text!template_components_activityreward'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_activityreward) {
    'use strict';

    return can.Control.extend({

      helpers: {
        'lehu-img': function(imgprefix, img) {
          if (_.isFunction(img)) {
            img = img();
          }

          if (img.indexOf("http://") > -1) {
            return img;
          }

          return imgprefix + img;
        }
      },

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();
        this.render();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
        // this.URL.SERVER_URL_NJ = 'http://172.16.201.68:8083/ptapp/';
      },

      render: function() {
        var that = this;

        this.param = {};

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL + "queryGiftsActivityDetail.do",
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            that.options.data = data.giftsActivityDetail;
            that.options.imgprefix = that.URL.IMAGE_URL;

            var renderList = can.mustache(template_components_activityreward);
            var html = renderList(that.options, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {
            util.tip(error.msg);
          })
      },

      //去商品详情
      ".fullgive_list img click": function(element, event) {
        var goodsid = element.attr("data-goodsid");
        var goodsno = element.attr("data-goodsno");
        var storeid = element.attr("data-storeid");

        this.toDetail(storeid, goodsno, goodsid);
      },

      isLogin: function() {
        var param = can.deparam(window.location.search.substr(1));

        this.userId = busizutil.getUserId();
        if (!this.userId) {
          if (util.isMobile.WeChat() || param.from == 'share') {
            location.href = "login.html?from=" + escape(location.href);
            return false;
          } else {
            var jsonParams = {
              'funName': 'login',
              'params': {
                "backurl": "index"
              }
            };
            LHHybrid.nativeFun(jsonParams);

            return false;
          }
        }

        return true;
      },

      //加入购物车
      ".fullgive_list i click": function(element, event) {

        if (!this.isLogin()) {
          return false;
        }
        var goodsid = element.attr("data-goodsid");
        var goodsno = element.attr("data-goodsno");
        var storeid = element.attr("data-storeid");

        var jsonParams = {
          'funName': 'addto_shopping_cart',
          'params': {
            'select_good_Num': 1,
            'goods_no': goodsno,
            'goods_id': goodsid
          }
        };
        LHHybrid.nativeFun(jsonParams);
      },

      //去购物车
      "#gotocart click": function(element, event) {

        var jsonParams = {
          'funName': 'goto_shopping_cart',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
      },

      toDetail: function(STORE_ID, GOODS_NO, GOODS_ID) {
        var jsonParams = {
          'funName': 'good_detail_fun',
          'params': {
            'STORE_ID': STORE_ID,
            'GOODS_NO': GOODS_NO,
            'GOODS_ID': GOODS_ID
          }
        };
        LHHybrid.nativeFun(jsonParams);
      },

      '.back click': function() {
        // temp begin  
        // 在app外部使用 点击返回 如果没有可返回则关闭掉页面
        var param = can.deparam(window.location.search.substr(1));
        if (!param.version) {
          if (history.length == 1) {
            window.opener = null;
            window.close();
          } else {
            history.go(-1);
          }
          return false;
        }
        // temp end

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