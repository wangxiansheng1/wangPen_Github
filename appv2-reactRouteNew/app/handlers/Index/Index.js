/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var Banner = require('./Banner');
var Tags = require('./Tags');
var Secondkill = require('./Secondkill');
var HotRecommendation = require('./HotRecommendation');
var ProductList = require('./ProductList');
var Discovery = require('./Discovery');

var Index = module.exports = React.createClass({

  statics: {
    fetchData: (token, params, query) => {
      return api.get('/initIndex.do', token);
    }
  },

  componentDidMount: function() {
    var LazyloadImg = require('./../vendor/lazyloadImg');
    var lazyloadImg = new LazyloadImg({
      el: '[data-src]',
      top: 50,
      right: -800,
      bottom: 50,
      left: 50,
      qriginal: false,
      before: function(el) {

      },
      load: function(el) {
        el.style.cssText += '-webkit-animation: fadeIn 01s ease 0.2s 1 both;animation: fadeIn 1s ease 0.2s 1 both;';
      },
      error: function(el) {

      }
    });

    window.addEventListener('scroll', (event) => {
      lazyloadImg.start();
    });
  },

  render: function() {
    return (
      <div>
        <Banner {...this.props} ></Banner>
        <Tags {...this.props} ></Tags>
        <Secondkill {...this.props} ></Secondkill>
        <HotRecommendation {...this.props} ></HotRecommendation>
        <ProductList {...this.props} ></ProductList>
        <Discovery {...this.props} ></Discovery>
      </div>
    );
  }
});