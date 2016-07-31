/**
 * @fileoverview lizard2.0 seo配置程序
 * @author wliao <wliao@Ctrip.com>
 */
var config = {
  webapp: {
    protocol: 'http:',
    host: '127.0.0.1'
  },
  nodePort: 8000,
  log: {
    // log的层级
    depth: 1
  },
  commtmpls: ['footer', 'header', 'top', 'top_aid', 'top_header', 'top_search', 'top_cart', 'footer_main', 'error'],
  jsversion: 1,
  retryTimes: 2
};

module.exports = config;