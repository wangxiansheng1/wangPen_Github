// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

var Root = require('./handlers/Root');
var Index = require('./handlers/Index/Index');
var List = require('./handlers/List/Index');

module.exports = {
	path: '/',
	component: Root,
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [List])
		})
	},
	indexRoute: {
		component: Index
	}
}