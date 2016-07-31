// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.calculate
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.calculate',
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
      METHOD_NAME: 'order.calculate',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'items': 'string', 'coupon_self_id': 'string', 'coupon_provider_id': 'string'
      },
      OPTIONAL: {
        'totalAmount': 'double', 'items': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40111': '用户不存在'
      }
    }
  });
});