// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.cancel
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.cancel',
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
      METHOD_NAME: 'order.cancel',
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
        '30051': '输入参数有误'
      }
    }
  });
});