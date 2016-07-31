// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.promotion.product.single
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.promotion.product.single',
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
      METHOD_NAME: 'promotion.product.single',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'id': 'long',
      },
      OPTIONAL: {
        'activityId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10012': '该商品在白名单中不存在'
      }
    }
  });
});