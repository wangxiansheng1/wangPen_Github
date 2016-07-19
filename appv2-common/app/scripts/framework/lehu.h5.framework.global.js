define('lehu.h5.framework.global', ['can'], function(can) {
  'use strict';

  var Global = can.Control.extend({

    init: function() {

      //1. 页面rem计算
      this.initRem();

      //2. 显示文档结构
      this.showDocument();
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
      document.documentElement.style.fontSize = 100 * (clientWidth / 640) + 'px';
    }
  });

  return new Global();

});