define('lehu.h5.component.activities', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'underscore',

    'imagelazyload',

    'text!template_components_activities'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, _,
    imagelazyload,
    template_components_activities) {
    'use strict';

    var DEFAULT_PAGE_INDEX = 0;
    var NODATA = false;

    can.route.ready();

    return can.Control.extend({

      helpers: {
        'lehu.img': function(imgprefix, img) {
          if (_.isFunction(img)) {
            img = img();
          }

          return imgprefix + img;
        }
      },

      init: function() {
        this.initData();
        this.render();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
        this.URL.SERVER_URL = 'http://app.lehumall.com/'
      },

      render: function() {
        var that = this;
        var params = can.deparam(window.location.search.substr(1));
        params = _.extend(params, can.route.attr());

        var ids = params.ids;

        var idArr = ids.split("|");

        var firstId = idArr.shift();

        var query = can.param({
          pageIndex: DEFAULT_PAGE_INDEX,
          id: firstId,
          flag: params.flag
        });

        var api = new LHAPI({
          url: that.URL.SERVER_URL + 'appPrefecture.do?' + query,
          data: {}
        });
        api.sendRequest()
          .done(function(data) {

            that.options.imgprefix = that.URL.IMAGE_URL;
            that.options.summary = {};
            that.options.summary.bannerImg = data.list.prefecture[0].BIG_IMG;
            that.options.summary.activityName = data.list.TITLE;

            var renderFn = can.view.mustache(template_components_activities);
            var html = renderFn(that.options, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {

          })
          .then(function() {

            var apis = [];

            _.each(idArr, function(id) {
              var query = can.param({
                pageIndex: DEFAULT_PAGE_INDEX,
                id: id,
                flag: params.flag
              });

              var api = new LHAPI({
                url: that.URL.SERVER_URL + 'appPrefecture.do?' + query,
                data: {}
              });
              apis.push(api.sendRequest());
            })
            return can.when.apply(can, apis)
          })
          .done(function() {

            var length = arguments.length;

            var result = [];

            _.each(arguments, function(argument, index) {
              argument.list.bannerImg = argument.list.prefecture[0].BIG_IMG
              result.push(argument);
            })

            that.options.data = result;
            that.options.tabWidth = Math.floor(100 / (arguments.length));
            that.options.width = arguments.length * 108 * 2;

            var renderFn = can.view.mustache(template_components_activities);
            var html = renderFn(that.options, that.helpers);
            that.element.html(html);

            $(".list_main_nav li:first-child").addClass("active")

            that.autoFixed();
          })
      },

      /**
       * 设置自动悬浮
       * @param  {[type]} element [description]
       * @return {[type]} [description]
       */
      autoFixed: function(element) {
        // this.elevatorPosition = $('.cms-src-elevatorbar').position().top;
        // this.elevatorBarHeight = $(".cms-src-elevatorbar").height();

        // var elevatorBarElement = $('.cms-src-elevatorbar .elevator');
        var that = this;
        // if (that.isSupportSticky()) {
        //   $(element).parent().addClass('elevator-sticky');
        // } else {
        var nav = $(".list_main_nav").offset().top;

        $(window).scroll(function() {
          var s = $(window).scrollTop();
          if (s > nav) {
            $(".list_main_nav").css("position", "fixed");
            $(".list_main_nav").next().css("margin-top", ".9rem");
          } else {
            $(".list_main_nav").css("position", "relative");
            $(".list_main_nav").next().css("margin-top", "0rem");
          };

          // if ($(window).scrollTop() >= that.elevatorPosition) {
          //   elevatorBarElement.addClass('elevator-fixed');
          // } else if ($(window).scrollTop() < (that.elevatorPosition + that.elevatorBarHeight)) {
          //   elevatorBarElement.removeClass('elevator-fixed');
          // }
        });
        // }
      },

      isSupportSticky: function() {
        var vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-'],
          vendorListLength = vendorList.length,
          stickyElement = document.createElement('div');

        for (var i = 0; i < vendorListLength; i++) {
          stickyElement.style.position = vendorList[i] + 'sticky';
          if (stickyElement.style.position != '') {
            return true;
          }
        }
        return false;
      },

      ".list_main_nav li click": function(element, event) {
        var floorId = element.attr('data-floor');
        $(".list_main_nav li").removeClass("active");
        $(element).addClass("active");
        var floorPosition = $("#" + floorId).offset().top - $('.list_main_nav').height();
        $("body").scrollTop(floorPosition);
      },

      // '.cms-src-elevatorfloor click': function(element, event) {
      //   var floorId = element.attr('data-floor');

      //   var floorPosition = $("#" + floorId).offset().top - $(".cms-src-elevatorbar").height();
      //   $(window).scrollTop(floorPosition > 0 ? floorPosition : 0);
      //   // $('html,body').animate({
      //   //   scrollTop: floorPosition > 0 ? floorPosition : 0
      //   // }, 800);
      // },

      '.nindex_fanhui click': function() {

        if (util.isMobile.Android() || util.isMobile.Android()) {
          var jsonParams = {
            'funName': 'back_fun',
            'params': {}
          };
          LHHybrid.nativeFun(jsonParams);
          console.log('back_fun');
        } else {
          history.go(-1);
        }
      }

    });
  });