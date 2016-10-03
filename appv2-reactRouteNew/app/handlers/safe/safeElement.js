var React = require('react');
var safe = require('./safe');

var _func = React.createElement;

React.createElement = function(...args) {
	if (typeof args[0] === 'function' && !args[0]._isSafe) {
		safe(args[0]);
	}
	return _func.apply(this, args);
};