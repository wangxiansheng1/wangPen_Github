// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.address.get
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.address.get',
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
      METHOD_NAME: 'member.address.get',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'addressId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40033': '获取会员收货地址详细失败',
        '40111': '用户不存在'
      }
    }
  });
});