define('lehu.h5.component.login', [
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

    'text!template_components_login'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
    template_components_login) {
    'use strict';

    var DEFAULT_GOTO_URL = "index.html";

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();

        var params = can.deparam(window.location.search.substr(1));
        this.from = params.from;

        var renderList = can.mustache(template_components_login);
        var html = renderList(this.options);
        this.element.html(html);
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      '.txt_username keyup': function(element, event) {
        event && event.preventDefault();
        this.element.find('.item_tips').hide();
      },

      '.txt_password keyup': function(element, event) {
        event && event.preventDefault();
        this.element.find('.item_tips').hide();
      },

      /*密码显示按钮*/
      ".btn_off click": function(element, event) {
        if (element.hasClass('btn_on')) {
          element.removeClass('btn_on');
          element.prev().attr('type', 'password');
        } else {
          element.addClass('btn_on');
          element.prev().attr('type', 'text');
        }
      },

      '.btn_login click': function(element, event) {
        var that = this;

        var userName = $(".txt_username").val();
        var passWord = $(".txt_password").val();
        if (userName == "") {
          $(".err_msg").text("用户名不能为空!").parent().css("display", "block");
          return false;
        }
        if (passWord == "") {
          $(".err_msg").text("密码不能为空!").parent().css("display", "block")
          return false;
        }

        this.param = {
          'userName': userName,
          'password': md5(passWord),
          'openId': "",
          'thirdPartyFlag': "-1",
          'origin': '5'
        };

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL + LHConfig.setting.action.login,
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            store.set("user", JSON.stringify(data.user));
            location.href = that.from || DEFAULT_GOTO_URL;
          })
          .fail(function(error) {
            alert("登录失败");
          })
      },

      '.rightlink click': function(element, event) {
        window.location.href = 'register.html';
      },

      '.back click': function() {

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