// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.balance.transactions
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.balance.transactions',
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
      METHOD_NAME: 'member.balance.transactions',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'page': 'int',
        'rows': 'int'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40111': '用户不存在'
      }
    }
  });
});