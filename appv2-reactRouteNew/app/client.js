// /** @jsx React.DOM */
var React = require('react');
var {
  render
} = require('react-dom');

var {
  match,
  Router,
  RouterContext
} = require('react-router');

var {
  EventEmitter
} = require('events');

var fetchData = require('./utils/fetchData');
var rehydrate = require('./utils/rehydrate');
var routes = require('./handlers/routes/RootRoute');

var loadingEvents = new EventEmitter();
var token = rehydrate();

const {
  pathname,
  search,
  hash
} = window.location
const location = `${pathname}${search}${hash}`

var extraProps = {
  title: 'some title'
};

function createElementFn(data) {
  return function(Component, props) {
    return <Component {...data} {...props} />
  }
}

match({
  routes,
  location
}, (error, redirectLocation, props) => {

  loadingEvents.emit('start');

  fetchData(token, props).then((data) => {
    loadingEvents.emit('end');

    var currentRouteData = {
      "data": data[window.location.pathname],
      "query": window.location.pathname,
      "loadingEvents": loadingEvents
    };

    render(<RouterContext {...props} createElement={createElementFn(currentRouteData)} />,
      document.getElementById('app')
    );
  });
})