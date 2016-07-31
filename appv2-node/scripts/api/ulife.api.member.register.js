// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.register
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.register',
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
      METHOD_NAME: 'member.register',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'userName': 'string',
        'password': 'string',
        'vCode': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40061': '手机号码格式错误',
        '40112': '验证码错误',
        '40113': '验证码过期',
        '40114': '手机号被占用',
        '40115': '注册失败'
      }
    }
  });
});