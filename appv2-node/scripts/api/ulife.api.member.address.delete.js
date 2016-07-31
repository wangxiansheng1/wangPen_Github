// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.address.delete
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.address.delete',
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
      METHOD_NAME: 'member.address.delete',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40037': '删除会员收货地址失败',
        '40111': '用户不存在'
      }
    }
  });
});