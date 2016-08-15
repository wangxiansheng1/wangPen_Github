var React = require('react');
var {
  Link,
  RouteHandler
} = require('react-router');
var TransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var api = require('../utils/api');

var Global = require('./Global');

var Root = module.exports = React.createClass({

  getInitialState() {
    return {
      longLoad: false
    };
  },

  componentDidMount() {
    var timeout;
    this.props.loadingEvents.on('start', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.setState({
          longLoad: true
        });
      }, 250);
    });
    this.props.loadingEvents.on('end', () => {
      clearTimeout(timeout);
      this.setState({
        longLoad: false
      });
    });

    Global.init();
  },

  render: function() {
    var className = 'App';
    if (this.state.longLoad)
      className += ' App--loading';
    return (
      <div className={className}>
        <TransitionGroup transitionName="detail">
          <RouteHandler {...this.props} />
        </TransitionGroup>
      </div>
    );
  }
});