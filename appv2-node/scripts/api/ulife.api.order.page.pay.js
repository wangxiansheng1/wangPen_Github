// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.page.pay
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.page.pay',
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
      METHOD_NAME: 'order.page.pay',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'sale_no': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '30001': '不存在该订单',
        '30061': '订单状态不可支付',
        '30098': '用户余额获取失败',
        '30099': '商品支付方式获取失败'
      }
    }
  });
});