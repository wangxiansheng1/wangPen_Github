// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.common.sms
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.common.sms',
[
  'jquery',
  'can',
  'underscore',
  'ulife.framework.comm',
  'ulife.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  'use strict';

  return Comm.extend({
    api: {
      METHOD_NAME: 'common.sms',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobileNo': 'string',
        'smsContext': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40061': '手机号码格式错误',
        '40117': '短信发送太频繁',
        '40118': '短信类型不存在'
      }
    }
  });
});