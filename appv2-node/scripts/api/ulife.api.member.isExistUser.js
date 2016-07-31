// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.isExistUser
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.isExistUser',
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
      METHOD_NAME: 'member.isExistUser',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobileNo': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});