// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
var React = require('react');

var {
	Route
} = require('react-router');
// var Root = require('./handlers/Root');
// var Index = require('./handlers/Index/Index');
// var List = require('./handlers/List/Index');

// module.exports = {
// 	path: '/',
// 	component: Root,
// 	getChildRoutes(location, cb) {
// 		require.ensure([], (require) => {
// 			cb(null, [List])
// 		})
// 	},
// 	indexRoute: {
// 		component: Index
// 	}
// }

const Root = require('./handlers/Root');

const Index = (location, callback) => {
	require.ensure([], require => {
		callback(null, require('./handlers/Index/Index'))
	}, 'index')
};

const List = (location, callback) => {
	require.ensure([], require => {
		callback(null, require('./handlers/List/Index'))
	}, 'list')
};

module.exports = (
	<Route path="/" component={Root}>
		<Route path="Index" getComponent={Index}></Route>
		<Route path="List" getComponent={List}></Route>
	</Route>
);