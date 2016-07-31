// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.cart.refresh
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.cart.refresh',
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
      METHOD_NAME: 'cart.refresh',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'items': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10089': '购物车刷新失败'
      }
    }
  });
});