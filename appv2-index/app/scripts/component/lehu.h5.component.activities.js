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
      },

      render: function() {
        var that = this;
        var params = can.deparam(window.location.search.substr(1));
        params = _.extend(params, can.route.attr());

        var ids = params.ids;

        var idArr = ids.split("|");

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

        can.when.apply(can, apis)
          .done(function() {

            var length = arguments.length;

            var result = [];

            _.each(arguments, function(argument) {
              argument.list.bannerImg = argument.list.prefecture[0].BIG_IMG
              result.push(argument);
            })

            that.options.data = result;
            that.options.imgprefix = that.URL.IMAGE_URL;
            that.options.tabWidth = Math.floor(100 / arguments.length);
            that.options.width = arguments.length * 108 * 2;

            var renderFn = can.view.mustache(template_components_activities);
            var html = renderFn(that.options, that.helpers);
            that.element.html(html);

            that.autoFixed();
          })
      },

      /**
       * 设置自动悬浮
       * @param  {[type]} element [description]
       * @return {[type]} [description]
       */
      autoFixed: function(element) {
        this.elevatorPosition = $('.cms-src-elevatorbar').position().top;
        this.elevatorBarHeight = $(".cms-src-elevatorbar").height();

        var elevatorBarElement = $('.cms-src-elevatorbar .elevator');
        var that = this;
        if (that.isSupportSticky()) {
          $(element).parent().addClass('elevator-sticky');
        } else {
          $(window).scroll(function() {
            if ($(window).scrollTop() >= that.elevatorPosition) {
              elevatorBarElement.addClass('elevator-fixed');
            } else if ($(window).scrollTop() < (that.elevatorPosition + that.elevatorBarHeight)) {
              elevatorBarElement.removeClass('elevator-fixed');
            }
          });
        }
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

      '.cms-src-elevatorfloor click': function(element, event) {
        var floorId = element.attr('data-floor');

        var floorPosition = $("#" + floorId).offset().top - $(".cms-src-elevatorbar").height();
        $(window).scrollTop(floorPosition > 0 ? floorPosition : 0);
      },

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