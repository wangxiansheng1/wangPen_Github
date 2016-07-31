// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.create
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.create',
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
      METHOD_NAME: 'order.create',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'address_id': 'int',
        'coupon_self_id': 'string',
        'coupon_provider_id': 'string',
        'items': 'string',
        'pay_type': 'string'
      },
      OPTIONAL: {
        'ship_date': 'long',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '30003': '地址不存在',
        '30011': '生成订单失败',
        '30012': '库存异常',
        '30014': '获取配送日期失败',
        '30016': '解析购物车商品失败',
        '30017': '解析购物车使用优惠失败',
        '30018': '优惠券使用失败',
        '30019': '生成订单号失败',
        '30020': '商品服务',
        '30093': '用户地址列表获取失败',
        '30095': '购物车获取商品信息失败',
        '30096': '用户优惠券列表获取失败',
        '30097': '优惠券计算失败'
      }
    }
  });
});