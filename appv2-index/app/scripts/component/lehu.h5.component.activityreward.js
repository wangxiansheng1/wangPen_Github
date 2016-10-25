define('lehu.h5.component.activityreward', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'md5',
    'store',

    'imagelazyload',
    'lehu.utils.busizutil',

    'text!template_components_activityreward'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_activityreward) {
    'use strict';

    return can.Control.extend({

      helpers: {
        'lehu-img': function(imgprefix, img) {
          if (_.isFunction(img)) {
            img = img();
          }

          if (img.indexOf("http://") > -1) {
            return img;
          }

          return imgprefix + img;
        }
      },

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();
        this.render();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      render: function() {
        var that = this;

        this.param = {};

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL_NJ + "queryGiftsActivityDetail.do",
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            that.options.data = data.giftsActivityDetail;
            that.options.imgprefix = that.URL.IMAGE_URL;

            var renderList = can.mustache(template_components_activityreward);
            var html = renderList(that.options, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {
            util.tip(error.msg);
          })
      },

      '.back click': function() {
        // temp begin  
        // 在app外部使用 点击返回 如果没有可返回则关闭掉页面
        var param = can.deparam(window.location.search.substr(1));
        if (!param.version) {
          if (history.length == 1) {
            window.opener = null;
            window.close();
          } else {
            history.go(-1);
          }
          return false;
        }
        // temp end

        if (util.isMobile.Android() || util.isMobile.iOS()) {
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