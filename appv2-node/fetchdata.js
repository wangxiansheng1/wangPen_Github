var request = require('ajax-request');

var RequestDatas = {
  sendRequest: function(model, callback) {
    request({
      url: model.url + '?' + model.postdata,
      headers: {
        'User-Agent': 'Node-Server',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'GET'
    }, function(err, response, data) {
      console.log('Request:' + model + ' Response:' + data);

      if (typeof callback != 'undefined') {
        return callback(err, response, data);
      }

    });
  }
}

module.exports = RequestDatas;