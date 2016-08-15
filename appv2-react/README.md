React Router Mega Demo
======================

Eventually this will be a mega demo, but right now its just a playground
for server-side rendering with react-router.

After cloning the repo, do this so check it out:

```sh
$ npm install
$ ./script/dev
# open http://localhost:5000
```

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

