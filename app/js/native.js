var native = function() {}

var ua = navigator.userAgent.toLowerCase();
if (/iphone|ipad|ipod/.test(ua)) {
	native.platfrom = "ios";
} else if (/android/.test(ua)) {
	native.platfrom = "android";
	var css=document.createElement("link");css.href = "css/plus/android.css";css.rel = "stylesheet";css.type = "text/css";document.getElementsByTagName('head').item(0).appendChild(css);
	
}



if (native.platfrom === "android") {
URLS.SERVER_URL = JSInterface.getServerUrl();
URLS.IMAGE_URL = JSInterface.getImageUrl();
} else if (native.platfrom == "ios") {
	URLS.SERVER_URL = "http://192.168.19.22:8082/";
	URLS.IMAGE_URL = "http://lehumall.b0.upaiyun.com/";
} else {
	URLS.SERVER_URL = "http://192.168.19.22:8082/";
	URLS.IMAGE_URL = "http://lehumall.b0.upaiyun.com/";
}


native.nativeFun = function(params) {

	if (native.platfrom === "android") {
		params = JSON.stringify(params);
		//android
		JSInterface.nativeFunction(params);
	} else if (native.platfrom === "ios") {
		//ios
		WebViewJavascriptBridge.send(params)
	}


}


native.getUserId = function() {

	var defer = $.Deferred();

	var userId;

	if (native.platfrom === "android") {
		userId = JSInterface.getUserId();
		defer.resolve(userId);
	} else if (native.platfrom === "ios") {
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