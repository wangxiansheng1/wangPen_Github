// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.info.update
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.info.update',
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
      METHOD_NAME: 'member.info.update',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'gender': 'int',
        'birthday': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40111': '用户不存在'
      }
    }
  });
});