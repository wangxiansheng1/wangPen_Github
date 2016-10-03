/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var hybrid = require('./../common/hybrid');

var Banner = module.exports = React.createClass({

  componentDidMount() {

  },

  helpers: {
    bannerImg: function(img) {
      return "http://lehumall.b0.upaiyun.com" + img;
    },
  },

  getTemplateByType: function(item) {
    var map = {
      1: (goods) => {
        return <div className='nindex_ad_one'><a href='javascript:;'>
              <img  className='lazyload' src={this.helpers.bannerImg(goods[0].IMG_URL)} />
              </a></div>;
      },
      2: (goods) => {
        return <div className='nindex_ad_two'>
              {
                goods.map((good) => {
                  return <a href='javascript:;'>
                         <img  className='lazyload' src={this.helpers.bannerImg(good.IMG_URL)} />
                         </a>
                })
              }
              </div>
      },
      3: (goods) => {
        return <div className='nindex_ad_three'>
              {
                goods.map((good) => {
                  return <a href='javascript:;'>
                         <img  className='lazyload' src={this.helpers.bannerImg(good.IMG_URL)} />
                         </a>
                })
              }
              </div>
      }
    }

    return map[item.TEMPLATE].apply(this, [item.goods]);
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