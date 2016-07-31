// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.DeliveryDates
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.DeliveryDates',
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
      METHOD_NAME: 'order.DeliveryDates',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'item_ids': 'string',
        'address_id': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '30093': '用户地址列表获取失败',
        '30094': '商品配送时间列表获取失败'
      }
    }
  });
});