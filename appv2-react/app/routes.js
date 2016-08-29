var React = require('react');
var {
  DefaultRoute,
  Route,
  NotFoundRoute
} = require('react-router');

module.exports = (token) => {

  return [
    <Route name="root" path="/" handler={require('./handlers/Root')}>
      <DefaultRoute handler={require('./handlers/Index/Index')} />
      <Route name="index" path="/index.html" handler={require('./handlers/Index/Index')} />
      <Route name="list" path="/list.html" handler={require('./handlers/List/Index')} />
    </Route>,
    <NotFoundRoute name="not-found" handler={require('./handlers/NotFound')}/>
  ];
};