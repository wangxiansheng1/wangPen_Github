var _ = require('underscore');
var schemaRegs = {},
  LocalRoute = {
    config: {},
    addConfig: function(obj) {
      for (var urlschema in obj) {
        if (obj.hasOwnProperty(urlschema)) {
          LocalRoute.config[urlschema] = obj[urlschema];
        }
      }
    },

    mapUrl: function(url) {
      var ret = '',
        lc = 0;
      if (LocalRoute.config.hasOwnProperty(url)) {
        return LocalRoute.config[url];
      }
      _.each(LocalRoute.config, function(item, urlSchema) {
        if (LocalRoute.config.hasOwnProperty(urlSchema)) {
          var parseRet = urlParse(urlSchema, url);
          if (parseRet.reStr && parseRet.param) {
            if (parseRet.reStr.length > lc) {
              lc = parseRet.reStr.length;
              ret = LocalRoute.config[urlSchema];
            }
          }
        }
      });
      if (!ret) {
        ret = LocalRoute.config.defaultView
      }
      return ret;
    }
  };

function reString(str) {
  var h = {
    '\r': '\\r',
    '\n': '\\n',
    '\t': '\\t'
  };
  var re1 = /([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g;
  var re2 = /[\r\t\n]/g;
  return str.replace(re1, "\\$1").replace(re2, function(a) {
    return h[a];
  });
}

function fixReString(str) {
  var chars = str.split('');
  var isInCharDict = false; // []
  var t = '';
  var ret = [];
  while (t = chars.shift(), t) {
    ret.push(t);
    if (t == '\\') {
      ret.push(chars.shift());
    } else if (t == '[' && !isInCharDict) {
      isInCharDict = true;
    } else if (t == ']' && isInCharDict) {
      isInCharDict = false;
    } else if (t == '(' && !isInCharDict) {
      if (chars[0] == '?') {
        if (chars[1] == '!') {} else if (chars[1] == ':' || chars[1] == '=') {
          chars.shift();
          chars.shift();
          ret.push('?');
          ret.push(':');
        } else {
          ret.push('?');
          ret.push(':');
        }
      }
    }
  }
  return ret.join('');
}

function urlParse(urlSchema, url) {
  var paraArr = [],
    tArr = [],
    params = {};
  var reStr = schemaRegs[urlSchema];
  if (_.isString(url) || _.isUndefined(reStr)) {
    reStr = schemaRegs[urlSchema] = urlSchema.replace(/\{\{(.+?)\}\}/g, function(a, b) {
      tArr.push(b);
      return '{@' + (tArr.length - 1) + '}';
    }).replace(/\{(@?)(.+?)\}|[^\{\}]+/g, function(a, b, c) {
      var ret = '';
      if (c) {
        if (b) {
          var pArr = tArr[c].match(/^(?:(?:\((\w+)\))?([^!=]+?)|([^!=]+?)=(.*))$/);
          if (pArr) {
            if (pArr[2]) {
              switch (pArr[1]) {
                case 'number':
                  ret = '(\\d+(?:\\.\\d*)?|\\.\\d+)';
                  break;
                case 'int':
                  ret = '(\\d+)';
                  break;
                case 'letter':
                  ret = '([a-z _\\-\\$]+)';
                  break;
                default:
                  ret = '([^\\\/]*)';
                  break;
              }
              paraArr.push(pArr[2]);
            } else {
              paraArr.push(pArr[3]);
              if (/^\/.*\/$/.test(pArr[4])) {
                ret = '(' + fixReString(pArr[4].slice(1, -1)) + ')';
              } else {
                var arr = pArr[4].split('||');
                for (var j = 0; j < arr.length; j++) {
                  arr[j] = reString(arr[j]);
                }
                ret = '(' + arr.join('|') + ')';
              }
            }
          } else {
            ret = '';
          }
        } else {
          paraArr.push(c);
          ret = '([^\\\/]*)';
        }
      } else {
        ret = reString(a);
      }
      return ret;
    });
  }
  if (_.isUndefined(url)) {
    return reStr;
  }
  url = url.replace(/[#\?].*$/g, '');
  var matches = url.match(new RegExp(reStr, 'i')),
    pathRe = '/([^\/]*)';
  if (reStr[reStr.length - 1] != '\\') {
    pathRe = '\\/([^\/]*)';
  }
  var morePathmatches = url.match(new RegExp(reStr + pathRe, 'i'));
  if (matches && !morePathmatches) {
    for (var i = 0; i < paraArr.length; i++) {
      params[paraArr[i]] = matches[i + 1] || null;
    }
    return {
      reStr: reStr,
      param: params,
      index: matches.index
    };
  }
  return {};
}

LocalRoute.addConfig({
  "/login": "template/login.html",
  "/register": "template/register.html",
  "/registersuccess": "template/registersuccess.html",
  "/forgetpwd": "template/retrieve.html",
  "/cart/list": "template/shoppingcart.html",
  "/index": "template/index.html",
  "/voucher/index": "template/voucher.html",
  "/jifen/index": "template/jifen.html",
  "/channel/{cid}": "template/channel.html",
  "/mskh": "template/channel.html",
  "/product/content/{pid}": "template/content.html",
  "/product/search": "template/list.html",
  "/product/search/": "template/list.html",
  "/product/list/{type}": "template/list.html",
  "/member/order/info": "template/info.html",
  "/member/order/order_success": "template/ordersuccess.html",
  "/member/pay/success": "template/paysuccess.html",
  "/member/{type}": "template/member.html",
  "/member/{type}/{subtype}": "template/member.html",
  "/member/order/orderdetail/{saleNo}": "template/member.html",
  "/help/article/{helpid}": "template/help.html",
  "/more_careful": "template/more_careful.html",

  "/groupList": "template/groupList.html",
  "defaultView": "template/not_found.html",
});

module.exports = LocalRoute;