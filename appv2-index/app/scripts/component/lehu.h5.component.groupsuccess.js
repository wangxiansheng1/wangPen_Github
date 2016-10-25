define('lehu.h5.component.groupsuccess', [
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

    'text!template_components_groupsuccess'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_groupsuccess) {
    'use strict';

    return can.Control.extend({

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
        this.options.data = new can.Map({
          "grouplist": null,
          "joinlist": null,
          "successlist": null
        });
      },

      render: function() {
        var that = this;

        this.param = {
          "page": 0,
          "pageNum": "20"
        };

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL_NJ + "groupActivityPage.do",
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            that.options.data.attr("grouplist", data.list);

            var renderList = can.mustache(template_components_groupsuccess);
            var html = renderList(that.options.data, that.helpers);
            that.element.html(html);
          })
          .fail(function(error) {
            var renderList = can.mustache(template_components_group);
            var html = renderList(that.options, that.helpers);
            that.element.html(html);
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