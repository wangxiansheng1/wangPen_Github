// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.cart.add
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.cart.add',
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
      METHOD_NAME: 'cart.add',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'items': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10090': '购物车添加失败,参数错误或者为空'
      }
    }
  });
});