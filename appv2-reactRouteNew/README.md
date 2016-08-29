# react-isomorphic
======================

基于react的同构项目

##运行：
1. 安装依赖 `npm install`
2. 执行启动 
	1. 开发模式 `script/dev`
	2. 编译打包 `script/build`
	3. 生产模式 `script/run`

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