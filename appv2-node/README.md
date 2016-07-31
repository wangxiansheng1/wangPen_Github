### 快速开始
#### 1. 新建content.html
在template目录下新建html文件，以content.html为例，模板配置如下：<br/>

		<!DOCTYPE html>
		<html>
			<head>
  				<!--#header.html-->
  			</head>
			<body>
				<div id="content"></div> <!-- 服务端渲染容器 -->
				<div id="client"></div> <!-- 客户端渲染容器 -->
			<script type="text/lizard-config">
 			{
    			"url_schema": "/product/content/{pid}",
  				"model": {
      				"apis":[],
      				"setTDK": function(datas){  <!-- landing页需要设置tdk供爬虫抓取 -->
        				return {
          					title: "",
          					description: "",
          					keywords: ""
        				}
      				},
      				"filter": function(datas) {
      	  				return data;
      				}
    			},
    			"view":{
      				"viewport": Lizard.T("viewportTmpl")
    			}
  			}
			</script>
			<script id="viewportTmpl" type="text/lizard-template">
			 <!-- 渲染完的html片段会被塞入#content节点中 -->
			</script>	
			</body>
		 </html>
#### 2. 添加路由
var/routeconfig.js的LocalRoute对象的addConfig方法中，新增content.html的路由。key设置为pathname，value则是文件的相对路径。

		LocalRoute.addConfig({
			"/product/content/{pid}"  : "template/content.html",
		})
#### 3. 新建controller
在scripts目录下新建detail.js

	define(
  	'ulife.page.detail',
  	[
    	'jquery',
    	'can',
    	'ulife.framework.comm',
	  	'ulife.component.comments'
  	],

  	function ($, can, FrameworkComm, Comment) {
  	  	FrameworkComm.register(2001)；
  	  	var detail = can.Control.extend({
	      	init:function(){
	        	this.component = {};
	        	this.render();
		    },
		    render:function(){
		        
		    }
	    });
	    new detail('body');
	  });
	
	require(['ulife.page.detail'])

在scripts/ulife.require.config.js中添加path
	
	'ulife.page.detail': 'scripts/detail',
	
在content.html的body底部，引入js文件

	<script src="/scripts/ulife.require.config.js"></script>
	<script type="text/javascript">
	  require(['ulife.page.detail']);
	</script>
#### 4. 调用后端服务
服务的功能有两类：<br/>
*	后端渲染<br/>
*	前端渲染
##### 后端渲染
在lizard-config中添加api 

	{
      url: Lizard.restfullApi + '/m.api',
      postdata: {
          _mt   : 'product.get',
          id    : Lizard.P('pid')//1000101
        }
    }
    
在lizard-template中使用underscore将数据绑定到模板上，如下所示：

	<div class="div_img">
      <a href="<%=item.mediaInfos[0]%>">
        <img data-src="<%=item.mediaInfos[0]%>">
      </a>
    </div>
    <div class="img_list clearfix">
      <span class="previous disabled"></span>
      <div class="div_pic clearfix">
        <ul>
          <%item.mediaInfos && _.each(item.mediaInfos, function(item, index){%>
          <li class="can_hover">
            <img data-source="<%=item%>">
          </li>
          <%})%>
        </ul>
      </div>
      <span class="next disabled"></span>
    </div>
    
##### <h5 id="clientRender">前端渲染</h5>
创建api<br/>
1. 在apigen.js的fileFilter中添加所需api，如ulife.api.cart.add<br/>
2. 执行grunt create<br/>
在scripts/apis目录下，即能看到ulife.api.cart.add.js

创建component<br/>
1. 在scripts/component目录下新建ulife.coponent.detail.js<br/>
2. amd的方式引入api


	define(
	
	  'ulife.component.detail',
	
	  [
	    'jquery',
	    'jquery.cookie',
	    'can',
	    'md5',
	    'store',
	    'jquery.jmodal',
	    'ulife.api.cart.add'
	  ],
	
	  function($, cookie, can, md5, store, jmodal, CartAdd) {
	    return can.Control.extend({
	
	      helpers: {
	      },
	      /**
	       * @override
	       * @description 初始化方法
	       */
	      init: function() {
	        this.getParams();
	        
	        this.component.cartAdd = new CartAdd();
	      },
	      getParams: function() {
	        var url = window.location.href, reg = /product\/content\/\d+/g;
	        this.params = {
	          itemId: url.match(reg)[0].substr(16),
	          num: $('#number').val()
	        };
	      },
	      /**
	       * @description 立即购买
	       * @param  {dom} element jquery dom对象
	       * @param  {event} event event对象
	       */
	      '#gobuy click': function(element, event) {
	        var postData = {
	          itemId: this.params.itemId,
	          num: $('#number').val()
	        };
	        this.component.cart.setData({
	          items: JSON.stringify([postData])
	        });
	        this.component.cart.sendRequest()
	          .done(function(data) {
	            
	          })
	          .fail(function(error, message) {
		          console.log(message);
	          },
	  });
	  
在ulife.require.config.js中为新增的api和component添加path

3.修改controller<br/>
在scripts/detail.js中引入component

	require.config({
	  paths: {
	    'jquery.jmodal'                 : '/scripts/vendor/jquery.jmodal',
	    'ulife.component.detail'        : '/scripts/component/ulife.component.detail',
	  }
	});
	define(
	  'ulife.page.detail',
	
	  [
	    'jquery',
	    'can',
	    'ulife.framework.comm',
	    'ulife.component.detail'
	  ],
	
	  function ($, can, SFFrameworkComm, SFDetail) {
	    SFFrameworkComm.register(2001)
	
	    var detail = can.Control.extend({
	
	
	      init:function(){
	        this.component = {};
	        this.render();
	      },
	
	      render:function(){
	        new SFDetail('#content');
	      }
	    });
	    new detail('body');
	  });
	require(['ulife.page.detail'])

至此，代码部分已完成，执行node grunt.app.js，在浏览器中打开http://localhost:8000/product/content/1000021


### Node服务端介绍
#### 1. 模板配置
##### lizard-config <br/>
创建一个script标签,将type设置为text/lizard-config

	{  
		"url_schema": ["/index"],  
		"model": {				
			"apis": [						
				{		
					name: "index",		
					url : Lizard.restfullApi + "/m.api",		
					postdata: function() {		
						_mt   : "product.get",		
					},		
					suspend: function() {},		
				}		
			],		
			"setTDK": function() {		
				return {		
					  title: "",		
					  description: "",		
					  keywords: ""		
					}		
			},		
			"filter": function(datas) {		
				return datas;		
			}		
		},		
		"view":{		
			"viewport": Lizard.T("viewportTmpl")		
		}		
	}		


##### lizard-template <br/>
创建一个script标签，将type设置为text/lizard-template，将id设置为lizard-config中viewport指定的节点即viewportTmpl。在此标签中，设置需要服务端渲染的html片段，绑定数据的部分使用underscore语法。如果要include公共模板，方法如下：

	<!--#top_aid.html-->
    <!--#top_header.html-->
    <!--#top_search.html-->
    
如需新增公共模板，首先在template/common目录下，添加相应的html文件，然后在var/config.js的commtmpls中注册该html文件的名字即可。
#### 2. 本地路由
服务端渲染的本质就是在node端通过本地路由的方式，将数据渲染到模板上，给前端返回html片段。
当node后端受到一个http请求时，会对照routeconfig中建立的路由表，映射到本地的html模板。接下来解析模板中所有的model请求，最终会调用underscore的template方法将数据渲染到模板上。

#### 3. 常用API
##### Lizard.P
介绍：获取url中的参数 <br/>
实例：urlschema是"/product/content/{pid}"，即url有一个参数pid，则获取pid的方式为Lizard.P('pid')
##### Lizard.D
介绍：当一个api的请求，依赖于另外一个api的返回数据时，可借助于Lizard.D<br/>
实例：

	{
      url: Lizard.restfullApi + '/m.api',
      postdata: function() {
        var ret = {},productList =  _.filter(JSON.parse(Lizard.D('index')).content[0].items, function(item){
          return item.type ==='productListPC';
        }),mts = [];
        _.each(productList, function(product){
          _.each(JSON.parse(product.data), function(item){
              mts.push(item.itemId);
          });
        });
        ret._mt = 'product.list';
        ret.page = 1;
        ret.rows = mts.length;
        ret.qurey = JSON.stringify({"ids": mts});
        return ret;
      }
    }
product.list这个请求需要post的数据，取决于name为index的model的返回。<br/>
同时可与suspend配合使用，suspend函数返回一个布尔值，决定是否发出这个model请求。

### 前端开发指南
>CanJS是一个轻量级的MVC库。它提供有MVC (Model-View-Control) 模式的基本框架，模板动态绑定，route的支持。

#### 新增api和component
可参考[快速开始](#clientRender)中前端渲染的介绍
#### 创建视图模型
默认的模板引擎是mustache，按照mustache语法创建的子模板一般放置在views目录下，views目录是http可访问的静态目录，便于源码调试。下面是一个子模板的例子：

	<div class="left f_left">
        <p>
            <label>订单号：</label><span>{{saleNo}}</span></p>
        <p>
            <label>{{payType}}：</label><span class="color_fc0018">￥{{totalAmount}}</span></p>
        {{#address}}
            <p>
                <label>收货人：</label><span>{{consignee}}</span></p>
            <p>
                <label>收货人电话：</label><span>{{mobile}}</span></p>
            <p>
                <label>送货地址：</label><span>{{city}} {{cityZone}} {{addressDetail}}</span></p>
        {{/address}}
        <p>
            <label>送货时间：</label>预计<span class="color_fc0018">{{shipDate}}</span>送达</p>
    </div>
更多关于mustache模板语法的资料可移步至官网[can.mustache](https://canjs.com/docs/can.mustache.html)。<br/>

在component中，通过text!的方式将子模板引入进来。打包后，会将模板和controller合并在一个js文件中。

	//template_component_address是通过text!方式引入进来的模板
	var renderFn = can.mustache(template_component_address);
    var html = renderFn(this.options.data, this.helpers);
    this.element.html(html);

options对象可将创建实例所需的参数对象传递给controller；当在模板中需要进行一些函数运算时，可借助于helpers

#### 数据请求
在component中引入api，以ulife.api.cart.add为例：

	this.cartAdd = new CartAdd();

	var postData = {
      itemId: this.params.itemId,
      num: $('#number').val()
    };
    this.cartAdd.setData({
      items: JSON.stringify([postData])
    });
    this.cartAdd.sendRequest()
      .done(function(data) {
        
      })
      .fail(function(error, message) {
       
      },
通过setData方法，将post的数据传递给this.cartAdd对象；在done和fail中分别处理sendRequest的成功回调和失败回调。

#### 事件绑定
>Control automatically binds prototype methods that look like event handlers

一次事件绑定的示例如下：

	'li click': function( li, event ) {
	    console.log( 'You clicked', li.text() );
	    
	    // let other controls know what happened
	    li.trigger( 'selected' );
	  }
### 打包介绍
1. dev环境
命令：grunt package:dev
生成文件路径和文件名：publish/ulifeweb-static.zip   解压该文件后会有ulifeweb-static包含着

2. test环境
命令：grunt package:test
生成文件路径和文件名：publish/ulifeweb-static.zip   解压该文件后会有ulifeweb-static包含着

3. prd环境
命令：grunt package:prd
生成文件路径和文件名：
publish/ulifeweb-static.zip   解压该文件后会有ulifeweb-static包含着
publish/ulifeweb-oss.zip   解压该文件后会有ulifeweb-oss包含着
