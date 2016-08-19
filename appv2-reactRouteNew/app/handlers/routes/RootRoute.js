// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

var Root = require('../Root');
var Index = require('../Index/Index');

module.exports = {
  path: '/',
  component: Root,
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [require('./AboutRoute')])
    })
  },
  indexRoute: {
    component: Index
  }
}