// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.password.reset
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.password.reset',
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
      METHOD_NAME: 'member.password.reset',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobileNo': 'string',
        'vCode': 'string',
        'newPassword': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40026': '重置密码失败',
        '40112': '验证码错误',
        '40116': '此帐号未注册'
      }
    }
  });
});