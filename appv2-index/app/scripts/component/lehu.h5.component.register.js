define('lehu.h5.component.register', [
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

    'text!template_components_register'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, md5, store,
    imagelazyload, busizutil,
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
        this.URL.SERVER_URL = 'http://app.lehumall.com/'
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

      '.btn_retransmit click': function(element, event) {
        var userName = $(".txt_phone").val();

        if (userName == "") {
          $(".err_msg").text("用户名不能为空!").parent().css("display", "block");
          return false;
        }

        this.param = {
          'phone': userName,
          'flag': "0"
        };

        busizutil.encription(this.param);

        var api = new LHAPI({
          url: this.URL.SERVER_URL + LHConfig.setting.action.verifycode,
          data: this.param,
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            console.log(data);
          })
          .fail(function(error) {
            alert("验证码发送成功");
          })
      },

      /**
       * 获取密码强度  
       * @param password
       * @return 1弱  2中  3强
       */
      getPasswordSafe: function(password) {
        if (!password) {
          return "1"
        }

        //数字，字母，特殊符号
        var hasNumber = 0;
        var hasZimu = 0;
        var hasOther = 0;

        var arr = password.split("");

        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item >= '0' && item <= '9') {
            //0-9数字
            hasNumber = 1;
            continue;
          }

          //65-90, 97-122
          if ((item >= 'A' && item <= 'Z') || (item >= 'a' && item <= 'z')) {
            hasZimu = 1;
            continue;
          } else {
            //其他字符都算为特殊字符
            hasOther = 1;
          }
        }
        return hasNumber | hasZimu | hasOther;
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
          'phone': userName,
          'password': md5(passWord),
          'code': captcha,
          'pwdSafe': this.getPasswordSafe(passWord),
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
            alert("注册失败");
          })
      }


    });

  });