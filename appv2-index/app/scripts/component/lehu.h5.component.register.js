define('lehu.h5.component.register', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',

    'imagelazyload',

    'text!template_components_register'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid,
    imagelazyload,
    template_components_register) {
    'use strict';

    return can.Control.extend({

      param: {},

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        this.initData();

        var renderList = can.mustache(template_components_register);
        var html = renderList(this.options);
        this.element.html(html);
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
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

        //   params.put("phone", phone);
        //       params.put("password", mPassword);
        //       params.put("pwdSafe", pwdSafe);
        //       params.put("code", code);
        //       if(!StringUtils.isBlank(referralCode)) {
        //         params.put("referralCode", referralCode);
        //       }
        //       Log.d("yzh", "promotionChannel = " + promotionChannel);
        //       //第三方渠道
        //       if(!"Umeng".equals(promotionChannel)) {
        //          params.put("promotionChannel", promotionChannel);
        // }
        //       //1:web;2:pc;3:android;4:ios;5:wp
        //       params.put("origin", "3");
        //       if (!StringUtils.isBlank(access_token)){
        //         params.put("access_token", access_token);
        //       }
        //       if (!StringUtils.isBlank(userIfoJson)){
        //         params.put("userIfoJson", userIfoJson);
        //       }
        //       if (thirdPartyFlag != 0){
        //         params.put("thirdPartyFlag", String.valueOf(thirdPartyFlag));
        //       }



        var userName = $(".txt_phone").val();
        var passWord = $(".txt_password").val();
        var captcha = $(".txt_sms_captcha").val();

        if (userName == "") {
          $(".err_msg").text("用户名不能为空!").parent().css("display", "block");
          return false;
        }
        if (captcha == "") {
          $(".err_msg").text("验证码不能为空!").parent().css("display", "block")
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
          url: this.URL.SERVER_URL + LHConfig.setting.action.register,
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
      }


    });

  });