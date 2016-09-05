define('lehu.h5.component.activityzhongqiu', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'underscore',

    'imagelazyload',
    'cryptojs.core',
    'tripledes',
    'cipher-md5',
    'enc-base64',

    'text!template_components_activityzhongqiu'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, _,
    imagelazyload, cryptojs, tripledes, ciphermd5, cipherbase64,
    template_components_activityzhongqiu) {
    'use strict';

    var userId = null;

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

      encription: function(params) {
        var currentTime = moment(new Date()).format('yyyyMMddHHmmss');

        params["time"] = currentTime;
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

        var keyHex = CryptoJS.enc.Utf8.parse();
        var encrypted = CryptoJS.TripleDES.encrypt(str, keyHex, {
          iv: CryptoJS.enc.Utf8.parse(DES3_IV),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

        var key = CryptoJS.MD5(KEY);

        // copy 3DES subkey 1 to the last 64 bit to make a full 192-bit key
        key.words[4] = key.words[0];
        key.words[5] = key.words[1];

        // create a 64-bit zero filled
        var iv = CryptoJS.lib.WordArray.create(64 / 8);
        var encrypted = CryptoJS.TripleDES.encrypt(str, key, {
          iv: iv
        });
        var encryptedBase64 = encrypted.toString();

        // 解密
        // var ct = {
        //   ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64)
        // };
        // var decrypted = CryptoJS.TripleDES.decrypt(ct, key, {
        //   iv: iv
        // });

        // var decoded = decrypted.toString(CryptoJS.enc.Utf8);

        return encryptedBase64;
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
            alert("领取成功");
          })
          .fail(function(error) {
            alert(JSON.stringify(error));
            alert("领取失败");
          });
      },

      '.nindex_fanhui click': function(element, event) {
        // var acitveId = $(element).attr("data-acitveId");
        var activeId = '2074';
        var param = can.deparam(window.location.search.substr(1));
        var userid = param.userid;
        if (!userid) {
          alert("userid不存在，去登录");
          var jsonParams = {
            'funName': 'login',
            'params': {}
          };
          LHHybrid.nativeFun(jsonParams);
        } else {
          alert("userid:" + userid + ";activeId:" + activeId);
          this.getCoupon(userid, activeId);
        }
      }
    });
  });