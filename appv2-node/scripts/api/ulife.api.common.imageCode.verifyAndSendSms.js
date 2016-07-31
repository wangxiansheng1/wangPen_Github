// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.common.imageCode.verifyAndSendSms
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.common.imageCode.verifyAndSendSms',
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
      METHOD_NAME: 'common.imageCode.verifyAndSendSms',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'vCode': 'string',
        'mobileNo': 'string',
        'smsContext': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40212': '图片验证码成功,短信发送失败！'
      }
    }
  });
});