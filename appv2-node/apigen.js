var _ = require('underscore'),
  request = require('request'),
  Mustache = require('mustache'),

  PREFIX = 'ulife.api.',
  ROOT_PATH = 'autogen/',
  FILE_PATH = 'scripts/',
  SECURITY_LEVEL = ['UserLogin', 'RegisteredDevice', 'None'],
  SECURITY_TYPE = {
    'UserLogin': 'SecurityType.UserLogin',
    'RegisteredDevice': 'SecurityType.RegisteredDevice',
    'None': 'SecurityType.None'
  },

  API_MUSTACHE = ROOT_PATH + '/mustache/api.mustache',

  SOURCE = [{
    name: 'haitao',
    src: 'http://gateway.dev.mbdev.ucaiyuan.com/docs?json',
    filename: 'haitao.json',

    filterGroup: ['member','cart', 'common', 'order','cms', 'promo','product','group'],

    fileFilter: [
      'ulife.api.cart.add',
      'ulife.api.cart.clean',
      'ulife.api.cart.cleanall',
      'ulife.api.cart.get',
      'ulife.api.cart.refresh',
      'ulife.api.cart.simpleinfo',

      'ulife.api.page.get',
      'ulife.api.cms.page.preview',

      'ulife.api.product.get',

      'ulife.api.common.sms',
      'ulife.api.common.imageCode.get',
      'ulife.api.common.imageCode.verify',
      'ulife.api.common.imageCode.verifyAndSendSms',
      'ulife.api.common.address',

      'ulife.api.member.address.get',
      'ulife.api.member.address.edit',
      'ulife.api.member.balance',
      'ulife.api.member.info',
      'ulife.api.member.address.delete',
      'ulife.api.member.address.edit',
      'ulife.api.member.address.get',
      'ulife.api.member.address',
      'ulife.api.member.balance',
      'ulife.api.member.balance.recharge',
      'ulife.api.member.balance.transactions',
      'ulife.api.member.info.get',
      'ulife.api.member.info',
      'ulife.api.member.info.update',
      'ulife.api.member.login',
      'ulife.api.member.logout',
      'ulife.api.member.nickname.update',
      'ulife.api.member.address',
      'ulife.api.member.address.delete',
      'ulife.api.member.page.my',
      'ulife.api.member.password.reset',
      'ulife.api.member.register',
      'ulife.api.member.isExistUser',

      'ulife.api.order.detail',
      'ulife.api.order.list',
      'ulife.api.order.logistics.tracking',
      'ulife.api.order.page.confirm',
      'ulife.api.order.pay',
      'ulife.api.order.create',
      'ulife.api.order.page.pay',
      'ulife.api.order.DeliveryDates',

      'ulife.api.product.list',

      'ulife.api.promotion.count',
      'ulife.api.promotion.list',

      'ulife.api.promotion.product.single',

      'ulife.api.group.activity.list'

    ]
  }];

function createJSON(grunt, done) {
  var count = 0;

  _.each(SOURCE, function(source, key, list) {
    var setting = {
      method: 'GET',
      url: source.src,
      gzip: true
    };

    request(setting, function(error, response, body) {
      count++;
      if (error) {
        return grunt.log.error(error);
      } else {
        grunt.log.ok('从服务端获得json索引文件:' + source.filename);
        grunt.file.write(ROOT_PATH + '/source/' + source.filename, body);
      }

      if (count == SOURCE.length) {
        createAPI(grunt, done);
      }
    });
  });
}

function createAPI(grunt, done) {
  var apiTpl = grunt.file.read(API_MUSTACHE, {
    encoding: 'utf8'
  });
  grunt.file.recurse(ROOT_PATH + '/source/', function(abspath, rootdir, subdir, file) {

    grunt.log.ok('开始解析索引文件:' + file);

    var data = grunt.file.read(ROOT_PATH + '/source/' + file, {
      encoding: 'utf8'
    });
    var found = _.findWhere(SOURCE, {
      filename: file
    });
    var json = JSON.parse(data);

    for (var i in json.apiList) {

      var it = json.apiList[i];
      if (it.parameterInfoList) {
        var info = it.parameterInfoList;
        if (_.isArray(info)) {
          for (var i = 0; i < info.length; i++) {
            if (i == info.length - 1) {
              info[i].last = true;
            }

            if (info[i].type.toLowerCase().indexOf('api') > -1) {
              info[i].type = 'json';
            }
          }
        } else {
          if (info.type.toLowerCase().indexOf('api') > -1) {
            info.type = 'json';
          }
          info.last = true;
        }
      }

      if (it.errorCodeList) {
        var error = it.errorCodeList;

        if (_.isArray(error)) {
          error[error.length - 1].last = true;
        } else {
          error.last = true;
        }
      }

      if (found.fileFilter.indexOf("ulife.api." + it.methodName) > -1 && found.filterGroup.indexOf(it.groupName) > -1 && SECURITY_LEVEL.indexOf(it.securityLevel) > -1) {
        it.securityType = SECURITY_TYPE[it.securityLevel];
        var fileContent = Mustache.render(apiTpl, it);
        grunt.file.write(FILE_PATH + '/api/' + PREFIX + it.methodName + '.js', fileContent);
      }
    }
  });

  done();
}

/**
 * @description 从不同的source中获得所有的API接口
 */
function autogen(grunt, done) {
  createJSON(grunt, done)
}

exports.autogen = autogen;
