var Global = module.exports = {
  init: function() {

    //1. 页面rem计算
    this.initRem();

    //2. 显示文档结构
    // this.showDocument();

    //3.设置样式
    // this.doStyles();
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
    this.setDocumentVisibility();
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
    document.addEventListener('resize', this.recalc, false);
  },

  recalc: function() {
    // var baseFontSize = 100;
    // var baseWidth = 320;
    // var clientWidth = document.documentElement.clientWidth || window.innerWidth;
    // var innerWidth = Math.max(Math.min(clientWidth, 480), 320);

    // var rem = 100;

    // if (innerWidth > 362 && innerWidth <= 375) {
    //   rem = Math.floor(innerWidth / baseWidth * baseFontSize * 0.9);
    // }

    // if (innerWidth > 375) {
    //   rem = Math.floor(innerWidth / baseWidth * baseFontSize * 0.84);
    // }

    // window.__baseREM = rem;
    // document.querySelector('html').style.fontSize = rem + 'px';

    // var clientWidth = document.documentElement.clientWidth || window.innerWidth;
    // document.querySelector('html').style.fontSize = 100 * (clientWidth / 640) + 'px';
  }
}