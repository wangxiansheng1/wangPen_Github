// Auto Generated.  DO NOT EDIT!
/**
  * @class ulife.api.member.address.edit
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'ulife.api.member.address.edit',
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
      METHOD_NAME: 'member.address.edit',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'long',
        'consignee': 'string',
        'mobileNo': 'string',
        'addressType': 'string',
        'isDefault': 'int',
        'province': 'string',
        'city': 'string',
        'cityZone': 'string',
        'addressDetail': 'string'
      },
      OPTIONAL: {
        'phoneNo': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '40042': '新增会员收货地址失败',
        '40052': '修改会员收货地址失败',
        '40053': '参数值不正确：province',
        '40054': '参数值不正确：city',
        '40055': '参数值不正确：cityZone',
        '40061': '手机号码格式错误',
        '40111': '用户不存在'
      }
    }
  });
});