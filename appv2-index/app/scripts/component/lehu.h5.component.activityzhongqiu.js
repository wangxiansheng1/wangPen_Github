define('lehu.h5.component.activityzhongqiu', [
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

    'text!template_components_activityzhongqiu'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, _, md5,
    imagelazyload, tripledes, modeecb,
    template_components_activityzhongqiu) {
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
      },

      render: function() {
        var renderFn = can.view.mustache(template_components_activityzhongqiu);
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

      //美容彩妆
      '#meirongactivity click': function(element, event) {
        location.href = "";
      },

      '#meirongproduct1 click': function(element, event) {
        //TODO
        // var GOODS_ID = "86356";
        // var GOODS_NO = "666666666";
        // var STORE_ID = "-1";

        // this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      '#meirongproduct2 click': function(element, event) {
        var GOODS_ID = "86356";
        var GOODS_NO = "666666666";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      //母婴专区
      '#moyingactivity click': function(element, event) {
        location.href = "";
      },

      '#moyingproduct1 click': function(element, event) {
        var GOODS_ID = "86078";
        var GOODS_NO = "10020005";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      '#moyingproduct2 click': function(element, event) {
        var GOODS_ID = "86250";
        var GOODS_NO = "10020124";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      //营养保健
      '#yingyangactivity click': function(element, event) {
        location.href = "";
      },

      '#yingyangproduct1 click': function(element, event) {
        var GOODS_ID = "86260";
        var GOODS_NO = "10020085";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      '#yingyangproduct2 click': function(element, event) {
        var GOODS_ID = "86259";
        var GOODS_NO = "10020084";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      //进口美食
      '#jinkouactivity click': function(element, event) {
        location.href = "";
      },

      '#jinkouproduct1 click': function(element, event) {
        var GOODS_ID = "90100";
        var GOODS_NO = "20000021";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      '#jinkouproduct2 click': function(element, event) {
        var GOODS_ID = "95360";
        var GOODS_NO = "20000024";
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      //家居日化
      '#jiajuactivity click': function(element, event) {
        location.href = "";
      },

      '#jiajuproduct1 click': function(element, event) {
        var GOODS_ID = "81880";
        var GOODS_NO = "102235/8009354"; //TODO
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      '#jiajuproduct2 click': function(element, event) {
        var GOODS_ID = "82840";
        var GOODS_NO = "107796/8012712"; //TODO
        var STORE_ID = "-1";

        this.toDetail(STORE_ID, GOODS_NO, GOODS_ID);
      },

      encription: function(params) {
        var paramStr = this.getSignDataString(params);
        params["mKey"] = paramStr;
      },

      getSignDataString: function(params) {
        var that = this;
        var arr = [];

        // 将Map变成Array，使用key=value的方式进行拼接
        _.each(params, function(value, key) {
          arr.push(key);
        });

        // 以ascii进行排序
        arr.sort();

        var result = [];
        _.each(arr, function(item) {
          result.push(that.des3(params[item]));
        })

        // 将队列拼接成String
        var str = result.join('');
        str = str + KEY;

        // 做md5加密
        return md5(str);
      },

      des3: function(str) {

        var keyHex = CryptoJS.enc.Utf8.parse(DES3_KEY);
        var encrypted = CryptoJS.TripleDES.encrypt(str, keyHex, {
          iv: CryptoJS.enc.Utf8.parse(DES3_IV),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
      },

      getCoupon: function(userId, acitveId) {
        var that = this;

        this.param = {
          "userId": userId,
          "acitveId": acitveId
        };

        this.encription(this.param);

        var api = new LHAPI({
          url: 'http://218.91.54.162:9006/' + LHConfig.setting.action.getLHTicket,
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            alert(data.msg);
          })
          .fail(function(error) {
            console.log(error);
            alert("领取失败");
          });
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