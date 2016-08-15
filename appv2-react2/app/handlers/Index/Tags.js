/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var Tags = module.exports = React.createClass({



  bannerImg: function(img) {
    return "http://lehumall.b0.upaiyun.com" + img;
  },

  render: function() {
    return (
      <div className="ntag" id="ajax_fastList">
          {
            this.props.data.lehu.fastList.map((tag) => {
                return <a href='javascript:;' key={tag.ID} data-tag={JSON.stringify(tag)}>
                  <img className='lazyload' data-src={this.bannerImg(tag.FAST_IMG)}/>
                  <span>{tag.FAST_NAME}</span>
                </a>
            })
          }
      </div>
    );
  }
});