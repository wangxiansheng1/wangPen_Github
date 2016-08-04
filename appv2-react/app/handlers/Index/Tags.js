/** @jsx React.DOM */
var React = require('react');
var api = require('../../utils/api');

var Tags = module.exports = React.createClass({
  render: function() {
    return (
      <div className="ntag" id="ajax_fastList">
          {
            this.props.data.root.fastList.map(function (tag) {
                return <a href='javascript:;' key={tag.ID} data-tag={JSON.stringify(tag)}>
                  <img className='lazyload' data-original={tag.FAST_IMG}/>
                  <span>{tag.FAST_NAME}</span>
                </a>
            })
          }
      </div>
    );
  }
});