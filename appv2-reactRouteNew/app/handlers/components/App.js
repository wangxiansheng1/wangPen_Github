var React = require('react');
var {
  Link
} = require('react-router');

var App = module.exports = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About (lazy loaded)</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})