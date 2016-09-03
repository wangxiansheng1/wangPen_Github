/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var hybrid = require('./../common/hybrid');

var PIC_LIMIT = 2;

var Banner = module.exports = React.createClass({

  componentDidMount() {

    // 滚动
    var swiper = require('./../vendor/swiper');
    var swiper = new Swiper('.nbanner .swiper-container', {
      pagination: '.nbanner .swiper-pagination',
      autoplay: 4000,
      autoplayDisableOnInteraction: false,
      speed: 300,
      loop: true,
      longSwipesRatio: 1
    });

    // 第三张之后图片懒加载
    var list = document.querySelectorAll('.nbanner [data-src]');
    for (var i = 0; i < list.length; i++) {
      if (i >= PIC_LIMIT - 1) {
        list[i].src = list[i].dataset["src"];
      }
    }

  },

  helpers: {
    bannerImg: function(img) {
      return "http://lehumall.b0.upaiyun.com" + img;
    },
  },

  render: function() {
    return (
      <div id="ajax_prommotionLayout">
          {
            this.props.data.prommotionLayout.map((prommotion) => {
              return <div>
                      <div className='ntuijian'>
                        <div className='ntuijian_top'>
                          <span><em>{prommotion['PROMOTION_NAME']}</em></span>
                        </div>

                        <div className='ntuijian_ad'>
                          <a href='javascript:;'></a>
                        </div>

                        <div className='ntuijian_main'>
                          <div className='swiper-container' style=''>
                            <div className='swiper-wrapper'>

                            {
                              prommotion.goodsList.map((good) => {
                                var PRICE = String(good['GOODS_PRICE'].toString());
                                var q = Math.floor(PRICE);
                                var h = (PRICE).slice(-2);

                                return <a href='javascript:;'>
                                      <img className='lazyload' data-original={this.good['GOODS_IMG']} />
                                      <title>{good['GOODS_NAME']}</title>
                                      <span>￥ {q} .<i> {h} </i></span>
                                      </a>
                              })
                            }

                            <a href='javascript:;' className='swiper-slide prommotionLayout_detail_more'>
                            <img className='lazyload' data-original='images/more.jpg'/>
                            </a>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className='nhr'></div>
                    </div>
            })

          }

          
      </div>
    );
  }
});