// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.promotion.exchange
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.promotion.exchange',
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
      METHOD_NAME: 'promotion.exchange',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'code': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '10008': '不存在该优惠券'
      }
    }
  });
});