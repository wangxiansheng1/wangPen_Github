/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var Banner = require('./Banner');
var Tags = require('./Tags');

var Index = module.exports = React.createClass({

  statics: {
    fetchData: (token, params, query) => {
      return api.get('/initIndex.do', token);
    }
  },

  render: function() {
    return (
      <div>
        <Banner {...this.props} ></Banner> 
        <Tags {...this.props} ></Tags>
      </div>
    );
  }
});