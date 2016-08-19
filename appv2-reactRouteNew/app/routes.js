var React = require('react');

// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

var Root = require('./handlers/Root');
var Index = require('./handlers/Index/Index');
var List = require('./handlers/List/Index');

module.exports = {
  path: '/',
  component: Root,
  indexRoute: {
    component: Index
  }
}

// var {
//   Router,
//   Route,
//   Link
// } = require('react-router');

// module.exports = (token) => {

//   // <Router>
//   //     <Route path="/" component={require('./handlers/Root')}>
//   //       <Route path="index" component={require('./handlers/Index/Index')} />
//   //       <Route path="list.html" component={require('./handlers/List/Index')} />
//   //     </Route>
//   //   </Router>

//   return [{
//     path: '/',
//     component: require('./handlers/Root'),
//     indexRoute: {
//       component: require('./handlers/Root')
//     },
//     childRoutes: [{
//       path: 'index',
//       component: require('./handlers/Index/Index')
//     }, {
//       path: 'inbox',
//       component: require('./handlers/List/Index')
//     }]
//   }]
// };