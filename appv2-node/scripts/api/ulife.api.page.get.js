// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.page.get
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.page.get',
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
      METHOD_NAME: 'page.get',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'type': 'int',
      },
      OPTIONAL: {
        'id': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '30101': '无效的 type 值',
        '30102': '页面没有找到'
      }
    }
  });
});