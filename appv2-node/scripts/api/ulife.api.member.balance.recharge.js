// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.balance.recharge
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.balance.recharge',
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
      METHOD_NAME: 'member.balance.recharge',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'cardNo': 'string',
        'password': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40102': '福利卡不能充值',
        '40103': '该卡已被他人绑定过',
        '40104': '该卡没有激活',
        '40105': '该卡不在有效期内',
        '40106': '该卡余额为0！',
        '40108': '卡号或者密码错误！',
        '40111': '用户不存在'
      }
    }
  });
});