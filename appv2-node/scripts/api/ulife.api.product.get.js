// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.product.get
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.product.get',
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
      METHOD_NAME: 'product.get',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'id': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10001': '不存在该优惠券',
        '10002': '优惠券列表获取失败',
        '10004': '优惠券兑换失败',
        '10005': '清空历史优惠券失败'
      }
    }
  });
});