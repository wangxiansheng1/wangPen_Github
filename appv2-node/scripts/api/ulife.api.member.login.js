// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.login
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.login',
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
      METHOD_NAME: 'member.login',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'userName': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'wxOpenId': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40001': '用户名或密码错误',
        '40072': '用户名不存在',
        '40073': '密码错误'
      }
    }
  });
});