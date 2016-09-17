define(
  'lehu.hybrid', [
    'zepto',
    'can',
    'underscore',
    'md5',
    'store',
    'lehu.util',
  ],

  function($, can, _, md5, store, LHUtil) {
    'use strict';

    //获得URL地址
    var getUrl = function() {
      var url = {};

      if (LHUtil.isMobile.Android() && window.JSInterface) {
        url.SERVER_URL = JSInterface.getServerUrl();
        url.IMAGE_URL = JSInterface.getImageUrl();
      } else {
        // url.SERVER_URL = "http://app.lehumall.com/";
        var host = window.location.host;
        if (host.indexOf("http://") == -1) {
          host = "http://" + host;
        }
        url.SERVER_URL = host + "/";
        url.IMAGE_URL = "http://lehumall.b0.upaiyun.com/";
      }

      return url;
    }

    // 运行native代码
    var nativeFun = function(params) {
      if (LHUtil.isMobile.Android()) {
        params = JSON.stringify(params);
        JSInterface.nativeFunction(params);
      } else if (LHUtil.isMobile.iOS()) {
        WebViewJavascriptBridge.send(params)
      }
    };

    return {
      "getUrl": getUrl,
      "nativeFun": nativeFun
    }

  });