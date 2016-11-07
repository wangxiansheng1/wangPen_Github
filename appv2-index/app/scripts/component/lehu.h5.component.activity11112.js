define('lehu.h5.component.activity11112', [
      'zepto',
      'can',
      'lehu.h5.business.config',
      'lehu.util',
      'lehu.h5.api',
      'lehu.hybrid',
      'underscore',
      'md5',

      'imagelazyload',
      'tripledes',
      'modeecb',
      'lehu.utils.busizutil',

      'text!template_components_activity11112'
    ],

    function($, can, LHConfig, util, LHAPI, LHHybrid, _, md5,
             imagelazyload, tripledes, modeecb, busizutil,
             template_components_activity11112) {
      'use strict';

      /**
       * 接口加密key
       */
      var KEY = "abc123wm456de789";
      var DES3_KEY = "eimseimseim@wm100$#365#$";
      var DES3_IV = "20141109";

      return can.Control.extend({

        helpers: {

        },

        init: function() {

          this.initData();

          this.render();
        },

        initData: function() {
          this.URL = LHHybrid.getUrl();
          this.URL.SERVER_URL = 'http://app.lehumall.com/'
        },

        render: function() {
          var renderFn = can.view.mustache(template_components_activity11112);
          var html = renderFn(this.options.data, this.helpers);
          this.element.html(html);

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

        ".activity_box a click": function(element, event) {
          var goodsid = element.attr("data-goodsid");
          var goodsno = element.attr("data-goodsno");
          var storeid = element.attr("data-storeid");
          this.toDetail(storeid, goodsno, goodsid);
        },

        '.activity_msg click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1175|1176&pageIndex=1&flag=2";
        },

        '.activity_box_01 .activity_box_top click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1272|1273|1274|1275|1276|1277&pageIndex=1&flag=2";
        },

        '.activity_box_02 .activity_box_top click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1278|1279|1280|1281|1282|1283&pageIndex=1&flag=2";
        },

        '.activity_box_03 .activity_box_top click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1284|1285|1286|1287|1288|1289&pageIndex=1&flag=2";
        },

        '.activity_box_04 .activity_box_top click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1302|1303|1304|1305|1306|1307&pageIndex=1&flag=2";
        },

        '.activity_box_05 .activity_box_top click': function(element, event) {
          window.location.href = "http://app.lehumall.com/html5/app/activities.html?ids=1290|1291|1292|1293|1294|1295&pageIndex=1&flag=2";
        },



        '.nindex_fanhui click': function() {

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
        },

        '.getCoupon click': function(element, event) {
          var activeId = $(element).attr("data-acitveId");
          var param = can.deparam(window.location.search.substr(1));
          var userid = param.userid;
          if (!userid) {
            var jsonParams = {
              'funName': 'login',
              'params': {}
            };
            LHHybrid.nativeFun(jsonParams);
          } else {
            this.getCoupon(userid, activeId);
          }
        }
      });
    });