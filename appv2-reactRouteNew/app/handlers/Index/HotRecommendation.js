/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var hybrid = require('./../common/hybrid');

var Banner = module.exports = React.createclassName({

  componentDidMount() {

  },

  helpers: {
    bannerImg: function(img) {
      return "http://lehumall.b0.upaiyun.com" + img;
    },
  },

  getTemplateByType: function(item) {
    var map = {
      1: function() {
        return <div className='nindex_ad_one'><a href='javascript:;'>
              <img  className='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][0].IMG_URL + " />
              </a></div>;
      },
      2: function(goods) {
        return <div className='nindex_ad_two'>
              {
                goods.map((item) => {
                  return <a href='javascript:;'>
                         <img  className='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][i].IMG_URL + " />
                         </a>
                })
              }
              </div>
      },
      3: function(goods) {
        return <div className='nindex_ad_three'>
              {
                goods.map((item) => {
                  return <a href='javascript:;'>
                         <img  className='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][i].IMG_URL + " />
                         </a>
                })
              }
              </div>
      }
    }

    var result = map[item.TEMPLATE].apply(this, [item.goods]);
  },

  render: function() {
    return (
      <div>
        <div className="nindex_ad" id="ajax_hotRecommendation">

        {
          this.props.data.hotRecommendation.map((item) => {
            return this.getTemplateByType(item);
          })
        }

        </div>
        <div className="nhr"></div>
      </div>
    );
  }
});