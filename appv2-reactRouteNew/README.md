# react-isomorphic
======================

基于react的同构项目

##运行：
1. 安装依赖 `npm install`
2. 执行启动 
	1. 开发模式 `script/dev`
	2. 生产模式 `script/run`

##Isomorphic Javascript Benefits:
1. Better overall user experience
2. Search engine indexable
3. Easier code maintenance
4. Free progressive enhancements

##同构内容：
1. Isomorphic view
2. Isomorphic styles
3. Isomorphic routing
4. Isomorphic data fetching
5. Isomorphic configuration
6. Isomorphic localization

##ab性能测试

    ab -n1000 -c1000 http://localhost:5000/index

ab数据分析： [Apache Benchmark 的使用的个人浅薄经验](https://ruby-china.org/topics/13870)

##性能数据查看
	
	听云（15天免费） https://report.tingyun.com/server/application/132824/overview

##异常处理

[Node 出现 uncaughtException 之后的优雅退出方案](http://www.infoq.com/cn/articles/quit-scheme-of-node-uncaughtexception-emergence) 

[NodeJS服务总是崩溃的解决办法](http://www.lai18.com/content/2165774.html)

[Express 框架中对错误的统一处理](http://itbilu.com/nodejs/npm/41ctyLryW.html)

##数据吐出中文计算问题

	var write = module.exports = (string, type, res) => {
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(string, 'utf8'),
			'Content-Type': type
		});
		res.write(string, 'UTF-8');
		res.end();
	};

	中Content-Length不能为string.length