var util = require('util');
var config = require('../var/config');

function log(obj) {
  var result = util.inspect(obj, { 
    showHidden: true,
    colors: true,
    depth: config.log.depth
  }); 
  if (result && result.indexOf("An error occurred") > -1) {
    console.log((new Date()), result);  
  }
}
module.exports = log;