// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.promotion.list
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.promotion.list',
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
      METHOD_NAME: 'promotion.list',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'status': 'int',
      },
      OPTIONAL: {
        'totalAmount': 'double',
        'items': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10002': '优惠券列表获取失败'
      }
    }
  });
});