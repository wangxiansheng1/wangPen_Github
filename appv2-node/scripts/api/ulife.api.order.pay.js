// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.pay
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.pay',
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
      METHOD_NAME: 'order.pay',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'sale_no': 'string',
      },
      OPTIONAL: {
        'channel_no': 'string',
        'card_type': 'string',
        'is_balance': 'boolean',
        'openid': 'string',
        'return_url': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '-101': '',
        '30061': '订单状态不可支付',
        '30062': '支付请求失败',
        '30090': '用户扣款失败',
        '30091': '用户信息获取失败',
        '30098': '用户余额获取失败'
      }
    }
  });
});