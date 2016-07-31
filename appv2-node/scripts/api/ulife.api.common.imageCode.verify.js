// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.common.imageCode.verify
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.common.imageCode.verify',
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
      METHOD_NAME: 'common.imageCode.verify',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'vCode': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40211': '图片验证码,验证失败！'
      }
    }
  });
});