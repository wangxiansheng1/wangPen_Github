'use strict';

define('lehu.utils.busizutil', [
  'zepto',
  'can',
  'underscore',
  'md5',
  'store',

  'tripledes',
  'modeecb',

  'lehu.h5.business.config'
], function($, can, _, md5, store,
  tripledes, modeecb,
  config) {

  /**
   * 接口加密key
   */
  var KEY = "abc123wm456de789";
  var DES3_KEY = "eimseimseim@wm100$#365#$";
  var DES3_IV = "20141109";

  var encription = function(params) {
    var paramStr = getSignDataString(params);
    params["mKey"] = paramStr;
  }

  var getSignDataString = function(params) {
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
      result.push(des3(params[item]));
    })

    // 将队列拼接成String
    var str = result.join('');
    str = str + KEY;

    // 做md5加密
    return md5(str);
  }

  var des3 = function(str) {
    var keyHex = CryptoJS.enc.Utf8.parse(DES3_KEY);
    var encrypted = CryptoJS.TripleDES.encrypt(str, keyHex, {
      iv: CryptoJS.enc.Utf8.parse(DES3_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  return {
    encription: encription
  };

});