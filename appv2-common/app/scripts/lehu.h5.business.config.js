define('lehu.h5.common.business.config', ['zepto'], function($) {
  'use strict';

  //链接访问前缀
  var URL_HOST = 'http://app.lehumall.com/html5/app/';
  //action访问前缀
  var REQUEST_HOST = 'http://app.lehumall.com/'

  //版本号
  var VER = $('#version').attr('data-version') || Date.now();

  //超链接
  var LINK = {
    'index': URL_HOST + '?t=' + VER,
    'list': URL_HOST + 'list.html?t=' + VER
  };

  return {
    setting: {
      'ver': VER,
      'REQUEST_HOST': REQUEST_HOST,
      'link': LINK
    }
  };
});