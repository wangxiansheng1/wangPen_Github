var request = require('ajax-request');
var parser = require('./parser');
var log = require('./inspect');
var url = require('url');

function RequestDatas(url, body, cb, error, logger) {
  this.url = url;
  this.body = body;
  this.cb = cb;
  this.error = error;
  this.datas = {};
  this.logger = logger;
  this.request();
}

RequestDatas.prototype.request = function() {
  var modelsResult = JSON.parse(parser.LizardGetModels(this.url, this.body, this.getModelData()));
  var l = modelsResult.models.length;
  var count = 0;
  var self = this;
  debugger;
  if (l) {
    modelsResult.models.forEach(function(model) {
      var isJson = model.url.match(/\.(?:([^?.]+)\?|([^.]+)$)/);

      if (isJson) {
        if (isJson[1] === 'js' || isJson[2] === 'js') {
          isJson = false;
        } else {
          isJson = true;
        }
      } else {
        isJson = true;
      }

      console.log(self.logger);
      self.logger.time(model.url);
      request({
        url: model.url + '?' + self.param(model.postdata),
        headers: {
          'User-Agent': 'Node-Server',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'GET'
      }, function(err, response, data) {
        self.logger.timeEnd(model.url);
        count++;
        if (err) {
          self.datas[model.name] = {};
        } else {
          self.datas[model.name] = data;
          console.log(self.datas[model.name]);
        }

        log('Request:');
        log(model);
        log('Response:');
        log(data);

        if (count === l) {
          try {
            self.request();
          } catch (e) {
            self.error(e);
          }
        }
      });
    });
  } else {
    debugger;
    this.cb.call(this);
  }
};

RequestDatas.prototype.getModelData = function() {
  var keys = Object.keys(this.datas);

  if (keys.length) {
    return this.datas;
  } else {
    return null;
  }
};

RequestDatas.prototype.param = function(obj) {
  if (!obj) return '';
  var ret = [];
  for (var p in obj) {
    if (Array.isArray(obj[p])) {
      obj[p].forEach(function(v, i) {
        ret.push(p + '[' + i + ']=' + encodeURIComponent(v));
      })
    } else {
      ret.push(p + '=' + encodeURIComponent(obj[p]));
    }
  }
  return ret.join('&');
}


module.exports = RequestDatas;