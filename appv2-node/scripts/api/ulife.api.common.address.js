define('ulife.api.common.address',
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
        METHOD_NAME: 'common.address',
        SECURITY_TYPE: SecurityType.UserLogin.name,
        REQUIRED: {
        },
        OPTIONAL: {
        },
        VERIFY:{
        },
        ERROR_CODE: {
        }
      }
    });
  }
);