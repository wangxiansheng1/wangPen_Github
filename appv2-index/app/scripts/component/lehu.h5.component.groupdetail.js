define('lehu.h5.component.groupdetail', [
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

    'text!template_components_groupdetail'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_groupdetail) {
    'use strict';

    return can.Control.extend({

      helpers: {
        'lehu-img': function(imgprefix, img) {
          if (_.isFunction(imgprefix)) {
            imgprefix = imgprefix();
          }

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
        this.URL.SERVER_URL_NJ = "http://172.16.201.21:8080/"
      },

      render: function() {
        var param = can.deparam(window.location.search.substr(1));
        this.action = param.action;

        var map = {
          "open": "queryActivityInfo.do",
          "join": "partInActivityInfo.do",
          "success": "getSuccGroupInfo.do"
        }

        this.sendRequest(map[this.action], param.activityid, param.id);
      },

      /**
       *id（团的id），activityid（活动id）
       */
      sendRequest: function(action, activityId, id) {
        var that = this;

        var param = {
          "activityId": activityId
        }

        if (id) {
          param.id = id;
        }

        busizutil.encription(param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL_NJ + action,
          data: param,
          method: 'post'
        });

        api.sendRequest()
          .done(function(data) {

            //团信息
            that.options.activitymap = data.activitymap;

            //参团用户
            that.options.userlist = data.userlist;

            //优惠券
            that.options.ticketmap = data.ticketmap;

            that.options.groupmap = data.groupmap;

            if (that.options.ticketmap) {
              if (that.options.ticketmap.HQ_TYPE == "1") {
                that.options.ticketmap.TIP = "满" + that.options.ticketmap.DEMAND + "使用";
              } else if (that.options.ticketmap.HQ_TYPE == "2") {
                that.options.ticketmap.TIP = "面值" + that.options.ticketmap.PRICE;
              }
            }

            that.options.isopen = (typeof that.action != 'undefined' && that.action == 'open');

            //图片前缀
            that.options.imgprefix = that.URL.IMAGE_URL;

            var renderList = can.mustache(template_components_groupdetail);
            var html = renderList(that.options, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {
            util.tip(error.msg);
          })
      },

      ".footer_buy click": function() {
        var jsonParams = {
          'funName': 'OriginSourcePay',
          'params': {
            "storeName": 1,
            "goodsID": this.options.groupinfo.GOODS_ID,
            "goodName": this.options.groupinfo.TITLE,
            "goodsPrice": this.options.groupinfo.ACTIVEPRICE,
            "goodsImg": this.options.groupinfo.IMG
          }
        };
        LHHybrid.nativeFun(jsonParams);
      },

      '#opengroup click': function() {
        var jsonParams = {
          'funName': 'GroupBuyPay',
          'params': {
            "storeName": 1,
            "goodsID": this.options.groupinfo.GOODS_ID,
            "goodName": this.options.groupinfo.TITLE,
            "goodsPrice": this.options.groupinfo.ACTIVEPRICE,
            "goodsImg": this.options.groupinfo.IMG
          }
        };
        LHHybrid.nativeFun(jsonParams);
      },

      "#joingroup click": function() {
        var jsonParams = {
          'funName': 'GroupBuyPay',
          'params': {
            "storeName": 1,
            "goodsID": this.options.groupinfo.GOODS_ID,
            "goodName": this.options.groupinfo.TITLE,
            "goodsPrice": this.options.groupinfo.ACTIVEPRICE,
            "goodsImg": this.options.groupinfo.IMG
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