// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.page.confirm
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.page.confirm',
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
      METHOD_NAME: 'order.page.confirm',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'items': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '30014': '获取配送日期失败',
        '30016': '解析购物车商品失败',
        '30017': '解析购物车使用优惠失败',
        '30093': '用户地址列表获取失败',
        '30094': '商品配送时间列表获取失败',
        '30095': '购物车获取商品信息失败',
        '30096': '用户优惠券列表获取失败',
        '30097': '优惠券计算失败'
      }
    }
  });
});