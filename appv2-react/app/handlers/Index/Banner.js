/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');
var PicLazyLoad = require('./../vendor/PicLazyLoad');

var Banner = module.exports = React.createClass({

  componentDidMount() {
    PicLazyLoad.picLazyLoad(this.refs.lazyload, {
      threshold: 400
    });
  },

  render: function() {

    return (
      <div className="nbanner">
          <div className="swiper-container">
              <div className="swiper-wrapper" id="ajax_banner">
                  {
                    this.props.data.root.bannerList.map(function (banner) {
                        return <div className="swiper-slide" key={banner.ID} data-banner={JSON.stringify(banner)}><img className='lazyload' ref="lazyload" data-original={banner.BANNER_IMG}/></div>
                    })
                  }
              </div>
              <div className="swiper-pagination"></div>
          </div>
      </div>
    );
  }
});