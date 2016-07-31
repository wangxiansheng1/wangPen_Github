// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.order.logistics.tracking
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.order.logistics.tracking',
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
      METHOD_NAME: 'order.logistics.tracking',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'sale_no': 'string',
      },
      OPTIONAL: {
        'ship_order_no': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});