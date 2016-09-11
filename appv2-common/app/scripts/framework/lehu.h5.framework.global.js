define('lehu.h5.framework.global', [
  'can', 'lehu.util'
], function(can, LHUtil) {
  'use strict';

  var Global = can.Control.extend({

    init: function() {

      //1. 页面rem计算
      this.initRem();

      //2. 显示文档结构
      this.showDocument();

      //3.设置样式
      this.doStyles();
    },

    doStyles: function() {
      if (LHUtil.isMobile.Android()) {
        var css = document.createElement("link");
        css.href = "styles/lehu.h5.android.css";
        css.rel = "stylesheet";
        css.type = "text/css";
        document.getElementsByTagName('head').item(0).appendChild(css);
      }
    },

    // 显示文档结构
    showDocument: function() {
      var that = this;

      $(document).ready(function(e) {
        that.setDocumentVisibility();
      });

      setTimeout(function() {
        that.setDocumentVisibility();
      }, 200);
    },

    setDocumentVisibility: function() {
      $("body").css("visibility", "visible");
      $("body").addClass("jbox");
    },

    //页面rem计算
    initRem: function(argument) {

      this.recalc();

      if (!document.addEventListener) {
        return false;
      }

      window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', this.recalc, false);
      document.addEventListener('DOMContentLoaded', this.recalc, false);
    },

    recalc: function() {
      // ?为啥两个一样的变量 这不被覆盖了么
      var clientWidth = document.documentElement.clientWidth;
      var clientWidth = $(".nwrapper").width();

      var maxWidth = 640;
      if (location.href.indexOf("activityzhongqiu.html") > -1 || location.href.indexOf("activityzhongqiu2.html") > -1 || location.href.indexOf("activities.html") > -1 || location.href.indexOf("activity.html") > -1) {
        maxWidth = 750;
      }

      document.documentElement.style.fontSize = 100 * (clientWidth / maxWidth) + 'px';
    }
  });

  return new Global();

});