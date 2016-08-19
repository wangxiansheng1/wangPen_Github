/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var getRoutes = require('./routes');
var fetchData = require('./utils/fetchData');
var rehydrate = require('./utils/rehydrate');
var routes = require('./handlers/routes/RootRoute');
var {
  EventEmitter
} = require('events');

var loadingEvents = new EventEmitter();
var token = rehydrate();

var renderState = {
  element: document.getElementById('app'),
  Handler: null,
  routerState: null
};

// var render = () => {
//   var {
//     element,
//     Handler,
//     routerState
//   } = renderState;
//   loadingEvents.emit('start');

//   fetchData(token, routerState)
//     .then((data) => {
//       loadingEvents.emit('end');
//       data.query = routerState.query;
//       React.render(<Handler data={data} loadingEvents={loadingEvents} />, element);
//     });
// };

// Router.run(getRoutes(token), Router.HistoryLocation, function(Handler, routerState) {

//   renderState.Handler = Handler;
//   renderState.routerState = routerState;
//   render();
// });


match({
  routes,
  location: req.url
}, (error, redirectLocation, renderProps) => {
  if (error) {
    res.status(500).send(error.message)
  } else if (redirectLocation) {
    res.redirect(302, redirectLocation.pathname + redirectLocation.search)
  } else if (renderProps) {
    renderApp(token, renderProps, res);
  } else {
    res.status(404).send('Not found')
  }
})