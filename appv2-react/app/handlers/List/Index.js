/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');
var safeElement = require('../safe/safeElement');

var Index = module.exports = React.createClass({

  statics: {
    fetchData: (token, params, query) => {
      return api.get('/goodsList.do', token, 'http://app.lehumall.com');
    }
  },

  componentDidMount: function() {
    console.log(this.props.data.query);
  },

  salesvolumeClick: function(element) {
    if (!element.hasClass("cur")) {
      $(".nlist_nomore").css("display", "none");
      $(".nlist_loading").css("display", "block");
      $(".nwrapper_list").addClass("one_loading");
      this.param["pageIndex"] = 1;
      this.param["sort"] = 2;
      this.param["sortMode"] = 1;
      this.param["sortType"] = 2;
      $("#ajax_goodsList").empty();
      this.goodsCategoryList();
      $("#price").removeClass("jiang");
      $("#price").removeClass("sheng");
    }
  },

  priceClick: function() {
    if (element.hasClass("sheng")) {
      element.removeClass("sheng");
      element.addClass("jiang");
      $(".nlist_nomore").css("display", "none");
      $(".nlist_loading").css("display", "block");
      $(".nwrapper_list").addClass("one_loading");
      this.param["pageIndex"] = 1;
      this.param["sort"] = 2;
      this.param["sortMode"] = 2;
      this.param["sortType"] = 2;
      $("#ajax_goodsList").empty();
      this.goodsCategoryList();

    } else {
      element.removeClass("jiang");
      element.addClass("sheng");
      $(".nlist_nomore").css("display", "none");
      $(".nlist_loading").css("display", "block");
      $(".nwrapper_list").addClass("one_loading");
      this.param["pageIndex"] = 1;
      this.param["sort"] = 2;
      this.param["sortMode"] = 2;
      this.param["sortType"] = 1;
      $("#ajax_goodsList").empty();
      this.goodsCategoryList();

    }
  },

  countreviewClick: function() {
    if (!element.hasClass("cur")) {
      $(".nlist_nomore").css("display", "none");
      $(".nlist_loading").css("display", "block");
      $(".nwrapper_list").addClass("one_loading");
      this.param["pageIndex"] = 1;
      this.param["sort"] = 2;
      this.param["sortMode"] = 3;
      this.param["sortType"] = 2;
      $("#ajax_goodsList").empty();
      this.goodsCategoryList();
      $("#price").removeClass("jiang");
      $("#price").removeClass("sheng");
    }
  },

  viewcountClick: function() {
    if (!$(this).hasClass("cur")) {
      $(".nlist_nomore").css("display", "none");
      $(".nlist_loading").css("display", "block");
      $(".nwrapper_list").addClass("one_loading");
      this.param["pageIndex"] = 1;
      this.param["sort"] = 2;
      this.param["sortMode"] = 4;
      this.param["sortType"] = 2;
      $("#ajax_goodsList").empty();
      this.goodsCategoryList();
      $("#price").removeClass("jiang");
      $("#price").removeClass("sheng");
    }
  },

  goodsCategoryList: function() {
    var that = this;

    var api = new LHAPI({
      url: this.URL.SERVER_URL + LHConfig.setting.action.goodsCategoryList,
      data: this.param,
      method: 'post'
    });
    api.sendRequest()
      .done(function(data) {
        $("html").attr("data_type", data.type);

        var html = "";
        //总页数
        that.totalPageNum = data.totalPageNum;
        var goodsList = data && data.goodsList;

        if (goodsList && goodsList.length > 0) {
          $(".nlist_nomore,.nlist_no").css("display", "none");
          for (var k = 0; k < goodsList.length; k++) {
            var zy = goodsList[k]['IS_CONSUMPTION_COUPON'];

            var PRICE = String(goodsList[k]['PRICE'].toString());
            var q = Math.floor(PRICE);
            var h = (PRICE).slice(-2);

            var DISCOUNT_PRICE = goodsList[k]['DISCOUNT_PRICE'];

            html += "<div class='nlist_list_main'  data-STORE_ID='" + goodsList[k]['STORE_ID'] + "' data-GOODS_NO='" + goodsList[k]['GOODS_NO'] + "' data-GOODS_ID='" + goodsList[k]['GOODS_ID'] + "' >";
            html += "<img class='nlist_list_mainleft lazyload'  src=" + that.URL.IMAGE_URL + goodsList[k]['GOODS_IMG'] + " >";
            html += "<div class='nlist_list_mainright'>";
            html += "<div class='nlist_list_title'>";

            html += goodsList[k]['GOODS_NAME'];
            html += "</div>";
            if (DISCOUNT_PRICE !== undefined) {
              var DISCOUNT_PRICEa = String(DISCOUNT_PRICE);
              var z_q = Math.floor(DISCOUNT_PRICEa);
              var z_h = (DISCOUNT_PRICEa).slice(-2);
              html += "<div class='nlist_list_jiage'><span>￥" + z_q + ".<em>" + z_h + "</em></span><i>￥<del>" + PRICE + "</del></i></div>";
            } else {
              html += "<div class='nlist_list_jiage'><span>￥" + q + ".<em>" + h + "</em></span></div>";
            }
            if (goodsList[k]['STORE_NAME']) {
              html += "<div class='nlist_list_pinglun'>" + goodsList[k]['STORE_NAME'] + "</div>";
            }
            html += "</div></div>";
          }
          $("#ajax_goodsList").append(html);
          that.lazyload();
          $(".nwrapper_list").removeClass("one_loading");

          $(".nlist_list_main").unbind('click').click(function() {
            var STORE_ID = $(this).attr("data-STORE_ID");
            var GOODS_NO = $(this).attr("data-GOODS_NO");
            var GOODS_ID = $(this).attr("data-GOODS_ID");
            var jsonParams = {
              'funName': 'good_detail_fun',
              'params': {
                'STORE_ID': STORE_ID,
                'GOODS_NO': GOODS_NO,
                'GOODS_ID': GOODS_ID
              }
            };
            LHHybrid.nativeFun(jsonParams);
            console.log('good_detail_fun');
            console.log("1");
          })

          //商品
          $(".nmiaosha_main a,.prommotionLayout_detail").click(function() {

            var STORE_ID = $(this).attr("data-STORE_ID");
            var GOODS_NO = $(this).attr("data-GOODS_NO");
            var GOODS_ID = $(this).attr("data-GOODS_ID");
            var jsonParams = {
              'funName': 'good_detail_fun',
              'params': {
                'STORE_ID': STORE_ID,
                'GOODS_NO': GOODS_NO,
                'GOODS_ID': GOODS_ID
              }
            };
            LHHybrid.nativeFun(jsonParams);

          })

        } else {
          that.nlist_no();
        }

        if (that.param["pageIndex"] == data["totalPageNum"]) {
          that.nlist_no();
        }
      })
      .fail(function(error) {
        $(".ajax_noload").show();
      });

  },

  render: function() {
    console.log(this.props.data.query);
    return (
      <div>
        <div className="ajax_noload">
          <img src="images/wifi.png"/>网络请求失败，请稍候再试
          <span><img src="images/sx.png"/></span>
        </div>

        <div className="nheader_list">
            <div className="nindex_fanhui"></div>
            <div className="nindex_sousuo" unselectable="on" style={{"MozUserSelect": "none", "WebkitUserSelect": "none"}} onselectstart="return false;"><em></em><b className="nkeyword">全球购，找到好口碑</b></div>
            <div className="list_style"></div>
        </div>

        <div className="nlist_top">
          <span className="cur" id="salesvolume" onClick={this.salesvolumeClick.bind(this, 1)}>销量</span>
          <span id="price" className="sheng0 " onClick={this.priceClick.bind(this, 1)}>价格</span>
          <span id="countreview" onClick={this.countreviewClick.bind(this, 1)}>评价</span>
          <span id="viewcount" onClick={this.viewcountClick.bind(this, 1)}>人气</span>
        </div>

        <div className="nlist_list nlist_list_kuai" id="ajax_goodsList"></div>
        <div className="clear"></div>

        <img src="images/loading.gif" className="nlist_loading"/>
        <img src="images/nomore.png" className="nlist_nomore"/>
        <img src="images/no.png" className="nlist_no"/>
        <a href="#" className="fix_go_top" onclick="return false;"></a>
      </div>
    );
  }
});