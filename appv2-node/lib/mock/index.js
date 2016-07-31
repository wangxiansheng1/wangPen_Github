var _ = require('underscore');
var fs = require('fs');
var path = require('path');

module.exports = {
	mock: function() {
		var body = [];
		var files = ['banner', 'tag', 'ad'];

		_.each(files, function(file) {
			var bannerHTML = fs.readFileSync(path.join(__dirname, '/data/html/' + file + '.html'), 'utf8');
			var bannerData = fs.readFileSync(path.join(__dirname, '/data/json/' + file + '.json'), 'utf8');
			body.push({
				'html': bannerHTML,
				'data': bannerData
			})
		})

		// var result = [];
		// _.each(body, function(item) {
		// 	var compiled = _.template(item.html);
		// 	result.push(compiled(JSON.parse(item.data)));
		// })
		// console.log(result.join(''));
		return JSON.stringify(body);
	}
}