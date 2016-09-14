requirejs.config({
    // urlArgs: "v=1.0",
    baseUrl: ' /',
    shim: {
        'modeecb': {
            deps: ['tripledes'],
            exports: "modeecb"
        }
    },
    paths: {
        "can": "http://www.google.com/bower_components/canjs/amd/can",
        "zepto": "http://www.google.com/zepto",
        "zeptoalone": "scripts/common/zepto.min",
        "zepto.cookie": "http://www.google.com/zepto.cookie",
        "underscore": "http://www.google.com/bower_components/underscore/underscore-min",
        "fastclick": "http://www.google.com/fastclick",
        "md5": "http://www.google.com/bower_components/blueimp-md5/js/md5.min",
        "underscore.string": "http://www.google.com/bower_components/underscore.string/dist/underscore.string.min",
        "store": "http://www.google.com/bower_components/store/dist/store",
        "text": "../bower_components/text/text",
        "placeholders": "bower_components/Placeholders/build/placeholders",
        "moment": "bower_components/momentjs/min/moment.min",
        "moment-zh-cn": "bower_components/momentjs/locale/zh-cn",

        "lehu.h5.framework.comm": "http://www.google.com/app/scripts/framework/lehu.h5.framework.comm",
        "lehu.h5.business.config": "http://www.google.com/app/scripts/config/lehu.h5.business.config",
        "lehu.h5.api": "http://www.google.com/app/scripts/framework/lehu.h5.api",
        "lehu.h5.framework.global": "scripts/common/lehu.h5.framework.global",

        "lehu.hybrid": "http://www.google.com/scripts/util/lehu.hybrid",
        "lehu.helpers": "http://www.google.com/scripts/util/lehu.helpers",
        "lehu.util": "http://www.google.com/scripts/util/lehu.util.fn",
        "lehu.env.switcher": "http://www.google.com/scripts/util/lehu.env.switcher",
        "lehu.bridge": "http://www.google.com/scripts/util/lehu.bridge",

        'lehu.h5.header.header': 'scripts/header/lehu.h5.header.header',
        'lehu.h5.header.footer': 'scripts/header/lehu.h5.header.footer',

        "lehu.h5.page.index": "scripts/page/lehu.h5.page.index",
        "lehu.h5.page.indexpre": "scripts/page/lehu.h5.page.indexpre",
        "lehu.h5.page.list": "scripts/page/lehu.h5.page.list",
        "lehu.h5.page.detail": "scripts/page/lehu.h5.page.detail",
        "lehu.h5.page.comment": "scripts/page/lehu.h5.page.comment",
        "lehu.h5.page.404": "scripts/page/lehu.h5.page.404",
        "lehu.h5.page.404index": "scripts/page/lehu.h5.page.404index",
        "lehu.h5.page.activity": "scripts/page/lehu.h5.page.activity",
        "lehu.h5.page.activities": "scripts/page/lehu.h5.page.activities",
        "lehu.h5.page.activityzhongqiu": "scripts/page/lehu.h5.page.activityzhongqiu",
        "lehu.h5.page.activityzhongqiu2": "scripts/page/lehu.h5.page.activityzhongqiu2",
        "lehu.h5.page.login": "scripts/page/lehu.h5.page.login",
        "lehu.h5.page.register": "scripts/page/lehu.h5.page.register",
        "lehu.h5.page.forgetpassword": "scripts/page/lehu.h5.page.forgetpassword",
        "lehu.h5.page.coupon": "scripts/page/lehu.h5.page.coupon",

        "lehu.h5.component.index": "scripts/component/lehu.h5.component.index",
        "lehu.h5.component.list": "scripts/component/lehu.h5.component.list",
        "lehu.h5.component.detail": "scripts/component/lehu.h5.component.detail",
        "lehu.h5.component.comment": "scripts/component/lehu.h5.component.comment",
        "lehu.h5.component.activity": "scripts/component/lehu.h5.component.activity",
        "lehu.h5.component.activities": "scripts/component/lehu.h5.component.activities",
        "lehu.h5.component.activityzhongqiu": "scripts/component/lehu.h5.component.activityzhongqiu",
        "lehu.h5.component.activityzhongqiu2": "scripts/component/lehu.h5.component.activityzhongqiu2",
        "lehu.h5.component.login": "scripts/component/lehu.h5.component.login",
        "lehu.h5.component.register": "scripts/component/lehu.h5.component.register",
        "lehu.h5.component.forgetpassword": "scripts/component/lehu.h5.component.forgetpassword",
        "lehu.h5.component.coupon": "scripts/component/lehu.h5.component.coupon",

        "template_header_footer": "templates/header/lehu.h5.header.footer.mustache",
        "template_header_header": "templates/header/lehu.h5.header.header.mustache",

        "template_components_index": "templates/components/lehu.h5.components.index.mustache",
        "template_components_list": "templates/components/lehu.h5.components.list.mustache",
        "template_components_detail": "templates/components/lehu.h5.components.detail.mustache",
        "template_components_comment": "templates/components/lehu.h5.components.comment.mustache",
        "template_components_activity": "templates/components/lehu.h5.components.activity.mustache",
        "template_components_activities": "templates/components/lehu.h5.components.activities.mustache",
        "template_components_activityzhongqiu": "templates/components/lehu.h5.components.activityzhongqiu.mustache",
        "template_components_activityzhongqiu2": "templates/components/lehu.h5.components.activityzhongqiu2.mustache",
        "template_components_login": "templates/components/lehu.h5.components.login.mustache",
        "template_components_register": "templates/components/lehu.h5.components.register.mustache",
        "template_components_forgetpassword": "templates/components/lehu.h5.components.forgetpassword.mustache",
        "template_components_coupon": "templates/components/lehu.h5.components.coupon.mustache",

        'lehu.utils.busizutil': 'scripts/utils/lehu.utils.busizutil',

        "swipe": "scripts/vendor/swipe",
        "slide": "scripts/vendor/slide",
        "imagelazyload": "scripts/vendor/zepto.picLazyLoad.min",

        // 3des加密
        'tripledes': '../bower_components/cryptojslib/rollups/tripledes',
        'modeecb': '../bower_components/cryptojslib/components/mode-ecb'
    }
});