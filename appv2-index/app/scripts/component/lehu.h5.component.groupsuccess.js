define('lehu.h5.component.groupsuccess', [
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

    'text!template_components_groupsuccess'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_groupsuccess) {
    'use strict';

    return can.Control.extend({

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
        this.options.data = new can.Map({
          "grouplist": null,
          "joinlist": null,
          "successlist": null
        });
      },

      render: function() {
        var param = can.deparam(window.location.search.substr(1));

        var map = {
          "open": "queryActivityInfo.do",
          "join": "partInActivityInfo.do",
          "success": "getSuccGroupInfo.do"
        }
        this.sendRequest(map[param.action], param.activityid, param.id);
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

        var api = new LHAPI({
          url: this.URL.SERVER_URL_NJ + action,
          data: param,
          method: 'post'
        });

        api.sendRequest()
          .done(function(data) {

            that.options.activitymap = data.activitymap;
            that.options.userlist = data.userlist;

            that.options.firstUser = that.options.userlist[0];
            that.options.secondUser = that.options.userlist[1];

            if (that.options.userlist.length > 2) {
              that.options.lastUser = that.options.userlist.slice(2);
            }

            var renderList = can.mustache(template_components_groupsuccess);
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

      "#sharetip click": function(element, event) {
        $("#sharetip").hide();
      },

      "#share click": function(element, event) {
        var param = can.deparam(window.location.search.substr(1));
        var version = param.version;
        if (!version && !util.isMobile.WeChat()) {
          util.tip("请升级app到最新版本后使用!");
          return false;
        }

        if (util.isMobile.WeChat()) {
          $("#sharetip").show();
          return false;
        }

        var jsonParams = {
          'funName': 'share_fun',
          'params': {
            'title': "汇银乐虎全球购-领券中心",
            'type': "1",
            'video_img': "",
            'shareUrl': 'http://' + window.location.host + "/html5/app/coupon.html?from=share",
            'shareImgUrl': "http://app.lehumall.com/html5/app/images/Shortcut_114_114.png",
            'text': "汇银乐虎全球购，赶紧领取优惠券吧，手慢无！"
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