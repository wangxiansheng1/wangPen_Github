var React = require('react');
var {
  DefaultRoute,
  Route,
  NotFoundRoute
} = require('react-router');

module.exports = (token) => {

  return [
    <Route name="root" path="/" handler={require('./handlers/Root')}>
      <DefaultRoute handler={require('./handlers/Home')} />
      <Route name="lehu" handler={require('./handlers/Index/Index')} />
    </Route>,
    <NotFoundRoute name="not-found" handler={require('./handlers/NotFound')}/>
  ];
};