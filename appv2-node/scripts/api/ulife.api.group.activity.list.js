// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.group.activity.list
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.group.activity.list',
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
      METHOD_NAME: 'group.activity.list',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'scope': 'int',
      },
      OPTIONAL: {
        'page': 'int',
        'rows': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '31002': '操作失败！',
        '31003': '参数错误！',
        '31004': '用户不存在！',
        '31005': '记录不存在！'
      }
    }
  });
});