define('lehu.h5.component.activityzhongqiu', [
    'zepto',
    'can',
    'lehu.h5.business.config',
    'lehu.util',
    'lehu.h5.api',
    'lehu.hybrid',
    'underscore',

    'imagelazyload',

    'text!template_components_activityzhongqiu'
  ],

  function($, can, LHConfig, util, LHAPI, LHHybrid, _,
    imagelazyload,
    template_components_activityzhongqiu) {
    'use strict';

    var userId = null;

    return can.Control.extend({

      helpers: {

      },

      init: function() {

        this.initData();

        this.render();
      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      render: function() {
        var renderFn = can.view.mustache(template_components_activityzhongqiu);
        var html = renderFn(this.options.data, this.helpers);
        this.element.html(html);
      },

      getCoupon: function(userId, acitveId) {
        var that = this;
        var api = new LHAPI({
          url: 'http://218.91.54.162:9006/' + LHConfig.setting.action.getLHTicket,
          data: {
            "userId": userId,
            "acitveId": acitveId,
            "mKey": "ef5767dcc2a8bebcfcbc42c4ad3c7889",
            "time": "20160701143818"
          },
          method: 'post'
        });
        api.sendRequest()
          .done(function(data) {
            alert("领取成功");
          })
          .fail(function(error) {
            alert(JSON.stringify(error));
            alert("领取失败");
          });
      },

      '.nindex_fanhui click': function(element, event) {
        // var acitveId = $(element).attr("data-acitveId");
        var activeId = '2063';
        var param = can.deparam(window.location.search.substr(1));
        var userid = param.userid;
        if (!userid) {
          alert("userid不存在，去登录");
          var jsonParams = {
            'funName': 'login',
            'params': {}
          };
          LHHybrid.nativeFun(jsonParams);
        } else {
          alert("userid:" + userid + ";activeId:" + activeId);
          this.getCoupon(userid, activeId);
        }
      }
    });
  });