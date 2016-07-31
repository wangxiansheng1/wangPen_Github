// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.cart.clean
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.cart.clean',
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
      METHOD_NAME: 'cart.clean',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'items': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10091': '购物车清除失败，参数错误请重新勾选添加'
      }
    }
  });
});