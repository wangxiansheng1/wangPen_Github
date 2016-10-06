/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var hybrid = require('./../common/hybrid');

var PIC_LIMIT = 2;

var Banner = module.exports = React.createClass({

  componentDidMount() {

  },

  helpers: {
    bannerImg: function(img) {
      if (img.indexOf("http://") > -1) {
        return img;
      }
      return "http://lehumall.b0.upaiyun.com/" + img;
    },
  },

  getCommonTemplate: function(item) {
    return <div className="nfaxian">
            <div className="nfaxian_main" id="ajax_showList">
              <div className='nshow_listmsg'>
                <a className=''>
                  <img className='lazyload' data-src={this.helpers.bannerImg(item.FACE_IMAGE_PATH)} />
                  <span className='nshow_listmsg_name ell'>
                    {item.USER_NAME}
                  </span>
                  <span className='nshow_listmsg_time'>{item.TIME} 发布于：
                    <b> {item.CIRCLE_NAME} </b>
                  </span>

                  <div className='nshow_listmsg_zh'>
                    <i className='nshow_iconfont'>&#xe601;</i><span>{item['LIKENUM']}</span>
                  </div>
                  <div className='nshow_listmsg_pl'>
                    <i className='nshow_iconfont'>&#xe600;</i><span>{item['APPRAISENUM']}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
  },

  render: function() {
    return (
      <div id="ajax_showList">

        {
          this.props.data.showList.map((item, index) => {
            var type = item['TYPE'];
            if (!item.FACE_IMAGE_PATH) {
              item.FACE_IMAGE_PATH = 'http://app.lehumall.com/html5/app/images/Shortcut_114_114.png';
            }

            var showImg = item['SHOW_IMG'].split(',')[0];

            return type == 3 ? (
              <div className='nshow_list_video' >
                <div className=' nshow_listbox_video'>
                  <video className='myVideo' src={this.helpers.bannerImg(item['SHOW_FILE'])} controls poster={item['VIDEO_IMG']}></video>
                </div>

                <div className='nshow_listbox_title ell'>{item.TITLE}</div>

                {this.getCommonTemplate(item)}
              </div>
            ) : (
              <div className='nshow_listbox' >
                <a href='javascript:;' className='nshow_listbox_img'>
                  <img className='lazyload' data-src={this.helpers.bannerImg(showImg)} />
                </a>

                <div className='nshow_listbox_title ell'>{item.TITLE}</div>

                {this.getCommonTemplate(item)}
              </div>
            )

          })
        }
      </div>
    );
  }
});