// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.cms.page.preview
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.cms.page.preview',
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
      METHOD_NAME: 'cms.page.preview',
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
        '30107': '参数错误，预览页面没有找到',
        '30108': 'JSON数据解析出错！'
      }
    }
  });
});