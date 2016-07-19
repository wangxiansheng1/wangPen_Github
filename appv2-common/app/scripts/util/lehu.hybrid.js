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
        url.SERVER_URL = "http://218.91.54.162:9006/";
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
    }

    var getUserId = function() {
      var defer = $.Deferred();

      var userId;

      if (LHUtil.isMobile.Android()) {
        userId = JSInterface.getUserId();
        defer.resolve(userId);
      } else if (LHUtil.isMobile.iOS()) {
        //ios获取userid

        function connectWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
          } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
              callback(WebViewJavascriptBridge)
            }, false)
          }
        }
        connectWebViewJavascriptBridge(function(bridge) { /* Init your app here */
          bridge.init(function(message, responseCallback) {
            userId = message.UserId;
            defer.resolve(userId);
          })

          bridge.registerHandler('onPageShow', function(data, responseCallback) {
            userId = data.UserId;
            defer.resolve(userId);
          })

          bridge.registerHandler('onPageHide', function(data, responseCallback) {

          })
        })
      }

      return defer.promise();
    }

    return {
      "getUrl": getUrl,
      "nativeFun": nativeFun,
      "getUserId": getUserId
    }

  });