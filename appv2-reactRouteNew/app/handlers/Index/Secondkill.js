/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var hybrid = require('./../common/hybrid');

var Secondkill = module.exports = React.createClass({

  getInitialState: function() {
    return {
      remark: '',
      timetext: '距离开始',
      hours: '',
      minutes: '',
      seconds: '',
      COMMODITY_LIST: [],

      nmiaosha_nhr_inlinestyle: {

      },
      remark_inlinestyle: {

      },

      juli: -1,
      shengyu: -1
    };
  },

  helpers: {
    bannerImg: function(img) {
      return "http://lehumall.b0.upaiyun.com" + img;
    },
  },

  componentDidMount: function() {
    var data = this.props.data;
    if (data.seckillList) {

      this.setState({
        nmiaosha_nhr_inlinestyle: {
          "display": "block"
        }
      });

      var seckillList = data.seckillList;

      this.setState({
        remark: seckillList['REMARK']
      });

      if (seckillList['END_TIME']) {
        var endtime = new Date(Date.parse(seckillList['END_TIME'].replace(/-/g, "/"))).getTime();
        endtime = endtime / 1000;
        var START_TIME = new Date(Date.parse(seckillList['START_TIME'].replace(/-/g, "/"))).getTime();
        START_TIME = START_TIME / 1000;

        var current_Time = new Date(Date.parse(data.currentTime.replace(/-/g, "/"))).getTime();
        current_Time = current_Time / 1000;

        this.setState({
          juli: START_TIME - current_Time,
          shengyu: endtime - current_Time
        });
      }

      //加载_秒杀列表
      var COMMODITY_LIST = data.seckillList['COMMODITY_LIST'];
      if (COMMODITY_LIST) {
        this.setState({
          nmiaosha_nhr_inlinestyle: {
            "display": "block"
          }
        });
        for (var k = 0; k < COMMODITY_LIST.length; k++) {
          var PRICE = String(COMMODITY_LIST[k]['GOODS_PRICE'].toString());
          var q = Math.floor(PRICE);
          var h = (PRICE).slice(-2);

          COMMODITY_LIST[k].q = q;
          COMMODITY_LIST[k].h = h;
        }

        this.setState({
          COMMODITY_LIST: COMMODITY_LIST
        });

        // this.lazyload();
      }

    } else {
      this.setState({
        nmiaosha_nhr_inlinestyle: {
          "display": "none"
        }
      });
    }

    var that = this;
    // 执行倒计时
    this.timer = setInterval(function() {
      that.countDown();
    }, 1000);
  },

  countDown: function() {
    var hours;
    var minutes;
    var seconds;

    if (this.state.juli >= 0) {
      hours = Math.floor(this.juli / 3600);
      minutes = Math.floor((this.juli % 3600) / 60);
      seconds = Math.floor(this.juli % 60);

      if (hours < 10) hours = '0' + hours;
      if (minutes < 10) minutes = '0' + minutes;
      if (seconds < 10) seconds = '0' + seconds;

      this.setState({
        timetext: "距离开始",
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });

      --this.juli;
    } else {
      hours = Math.floor(this.shengyu / 3600);
      minutes = Math.floor((this.shengyu % 3600) / 60);
      seconds = Math.floor(this.shengyu % 60);

      if (hours < 10) hours = '0' + hours;
      if (minutes < 10) minutes = '0' + minutes;
      if (seconds < 10) seconds = '0' + seconds;

      this.setState({
        timetext: "剩余",
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });

      this.setState({
        remark_inlinestyle: {
          "display": "inline-block"
        }
      });
      --this.state.shengyu;
    }

    if (this.state.shengyu < 0) {
      clearInterval(this.timer);
      this.setState({
        nmiaosha_nhr_inlinestyle: {
          "display": "none"
        }
      });
    }
  },

  render: function() {
    return (
      <div>
        <div className="nhr nmiaosha_nhr" style={this.state.nmiaosha_nhr_inlinestyle}></div>
    
        <div className="nmiaosha" style={this.state.nmiaosha_nhr_inlinestyle}>     
            <div className="nmiaosha_top">
                <img src="images/index_28.png" />&nbsp;
                <b className="ajax_timetext">距离开始</b>
                <span className="getting-started"><em>00</em>:<em>00</em>:<em>00</em></span>&nbsp;
                <i className="ajax_REMARK" style={this.state.remark_inlinestyle}>{this.state.remark}</i>
                <a href="javascript:;" data-title="nmiaosha_more" data-url="">更多&gt;&gt;</a>
            </div>
            <div className="nmiaosha_main" id="ajax_seckillList">
            {
                this.state.COMMODITY_LIST.map((item, index) => {
                  return <a href='javascript:;' >
                           <img className='lazyload' data-src={this.helpers.bannerImg(item['GOODS_IMG'])}/>
                           <title>{item['GOODS_NAME']}</title>
                           <span>￥{item.q}.<em>{item.h}</em></span>
                           <del>￥{item['ORIGINAL_PRICE']}</del>
                         </a>
                })
            }
            </div>
        </div>
    
        <div className="nhr"></div>
      </div>
    );
  }
});