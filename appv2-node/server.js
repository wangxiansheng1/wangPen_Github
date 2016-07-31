/**
 * @fileoverview Program entry for signal process
 * @author wliao <wliao@Ctrip.com>
 * @example
 * node grunt.app.js
 */
var express = require('express');
var app = express();
var compression = require('compression');
var config = require('./var/config');
var url = require('url');
var parser = require('./lib/parser');
var request = require('ajax-request');
var RequestDatas = require('./lib/request-datas');
var Logger = require('./lib/logger');
var fs = require('fs');
var _ = require('underscore');
var localRoute = require('./var/routeconfig');
var minify = require('html-minifier').minify;

app.use(compression());

//客户端
// app.use('/scripts', express.static('scripts'));
// app.use('/styles', express.static('styles'));
app.use('/views', express.static('views'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

app.use('/scripts', express.static('scripts', {
  setHeaders: function() {
    return {
      "Content-Type": "application/javascript; charset=utf-8"
    };
  }
}));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/google142809d331386819.html', express.static('google142809d331386819.html'));

app.get(/([\s\S]+)$/, response);
app.post(/([\s\S]+)$/, response);

function response(req, res, count) {
  var pathname = req.params[0],
    count = arguments[2] || 0;
  if (_.some(['/scripts', '/styles', '/img', '/css', '/images', '/favicon.ico', '/views'], function(x) {
      return pathname.indexOf(x) === 0;
    })) {
    res.status(404).send("");
    return;
  }
  var webappUrl = url.format({
    protocol: config.webapp.protocol,
    host: config.webapp.host,
    pathname: pathname,
    query: req.query
  });
  var logger = new Logger(webappUrl);

  logger.time('all');
  logger.time('template');
  var tmplpath;
  if (!pathname || pathname === '/') {
    tmplpath = "template/index.html";
  } else {
    tmplpath = localRoute.mapUrl(pathname);
  }

  var body = tmplcache[tmplpath];
  if (!body) {
    setTimeout(function() {
      response(req, res);
    }, 10);
    return;
  }
  logger.timeEnd('template');
  _.each(config.commtmpls, function(name) {
    //console.log(name);
    if (body.indexOf('<!--#' + name + '.html-->') > -1) {
      body = body.replace('<!--#' + name + '.html-->', commontmpls[name]);
    }
  });
  try {

    new RequestDatas(webappUrl, body.toString(), function() {
      logger.time('render');
      try {
        var html = parser.LizardRender(webappUrl, body, this.datas, config.jsversion);
        logger.timeEnd('render');
        logger.timeEnd('all');
        logger.write();
        if ("500 error" === html) {
          retry(req, res, count);
          return;
        }
        try {
          html = minify(html, {
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
          });
          res.send(html);
        } catch (e) {
          res.send(html);
        }
      } catch (e) {
        console.log('[', (new Date), ']', '[An render error occurred]', e.message);
        retry(req, res, count);
        logger.timeEnd('render');
        logger.write();
      }
    }, function(e) {
      console.log('[', (new Date), ']', '[An render error occurred]', e.message);
      retry(req, res, count);
    }, logger);
  } catch (e) {
    console.log('[', (new Date), ']', '[An render error occurred]', e.message);
    retry(req, res, count);
  }
}

function retry(req, res, count) {
  if (count >= config.retryTimes) {
    res.status(200).send(commontmpls['error']);
  } else {
    count++
    response(req, res, count);
  }
}

var commontmpls = {};
_.each(config.commtmpls, function(name) {
  commontmpls[name] = minify(fs.readFileSync('template/common/' + name + '.html', 'utf-8'), {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true
  });
});
commontmpls['header'] = commontmpls['header'].replace('#jsversion#', config.jsversion);

var tmplcache = {};

function cachePagetmpl(path) {
  fs.readFile(path, 'utf-8', function(err, body) {
    if (err) {
      setTimeout(function() {
        cachePagetmpl(path);
      }, 0)
    } else {
      tmplcache[path] = body;
    }
  });
}
_.each(localRoute.config, function(path, schema) {
  cachePagetmpl(path);
});

var port = process.env.PORT || config.nodePort;
app.listen(port);
console.log('app started on port ' + port);