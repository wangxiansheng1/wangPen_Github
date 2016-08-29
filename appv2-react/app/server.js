var express = require('express');
var app = express();

//相对于启动目录
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/../public/js/'));
app.use('/images', express.static(__dirname + '/../public/images/'));

// 引入系统库
var fs = require('fs');
var _ = require('underscore');
var React = require('react');
var Router = require('react-router');
var uuid = require('uuid');
var Cookies = require('cookies');

// 引入自定义库
var cache = require('./utils/cache');
var getRoutes = require('./routes.js');
var fetchData = require('./utils/fetchData');
var {
  templateMap,
  commonHtml
} = require('./config');

// app router
var renderApp = (req, token, cb) => {
  var path = req.url;
  var htmlRegex = /¡HTML!/;
  var dataRegex = /¡DATA!/;

  var router = Router.create({
    routes: getRoutes(token),
    location: path,
    onAbort: function(redirect) {
      cb({
        redirect
      });
    },
    onError: function(err) {
      console.log('Routing Error:' + err);
    }
  });

  router.run((Handler, state) => {

    if (state.routes[0].name === 'not-found') {
      var html = React.renderToStaticMarkup(<Handler/>);
      cb({
        notFound: true
      }, html);
      return;
    }
    fetchData(token, state).then((data) => {

      data.query = req.query;

      var clientHandoff = {
        token,
        data: cache.clean(token)
      };

      console.log(state.routes[0].name);

      var html = React.renderToString(<Handler data={data} />);
      var output = tmplcache[state.routes[0].name].replace(htmlRegex, html).replace(dataRegex, JSON.stringify(clientHandoff));

      _.each(commonHtml, function(name) {
        if (output.indexOf('<!--#' + name + '.html-->') > -1) {
          output = output.replace('<!--#' + name + '.html-->', commontmpls[name]);
        }
      });

      cb(null, output, token);

    });
  });
};

// 接受请求
app.get(/([\s\S]+)$/, response);
app.post(/([\s\S]+)$/, response);

function response(req, res, count) {

  var cookies = new Cookies(req, res);
  var token = cookies.get('token') || uuid();
  cookies.set('token', token, {
    maxAge: 30 * 24 * 60 * 60
  });

  renderApp(req, token, (error, html, token) => {

    if (!error) {
      console.log("req:" + req.url);
      res.status(200).send(html);
    } else if (error.redirect) {
      console.log("req:" + req.url + ", redirect:" + error.redirect);
      res.status(303);
    } else if (error.notFound) {
      console.log("req:" + req.url + ", notFound:" + error.notFound);
      res.status(404).send(html);
    }
  });
}

// 读取公共文件
var commontmpls = {};
_.each(commonHtml, function(name) {
  commontmpls[name] = fs.readFileSync(__dirname + '/templates/common/' + name + '.html', 'utf-8');
});

// 缓存模板
var tmplcache = {};

function cachePagetmpl(path, schema) {
  fs.readFile(__dirname + path, 'utf-8', function(err, body) {
    if (err) {
      setTimeout(function() {
        cachePagetmpl(path);
      }, 0)
    } else {
      tmplcache[schema] = body;
    }
  });
}
_.each(templateMap, function(path, schema) {
  cachePagetmpl(path, schema);
});

// 启动应用
app.listen(process.env.PORT || 5000);
console.log('app started on port ' + (process.env.PORT || 5000));