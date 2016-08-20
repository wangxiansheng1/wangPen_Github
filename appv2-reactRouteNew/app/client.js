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
var routes = require('./routes.js');

var loadingEvents = new EventEmitter();
var token = rehydrate();

const {
  pathname,
  search,
  hash
} = window.location
const location = `${pathname}${search}${hash}`

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

    var path = props.routes[0].path;
    var currentRouteData = {
      "data": data[path],
      "query": path,
      "loadingEvents": loadingEvents
    };

    render(<RouterContext {...props} createElement={createElementFn(currentRouteData)} />,
      document.getElementById('app')
    );
  });
})