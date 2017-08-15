var http = require('http')
var superagent = require('superagent')

var server = http.createServer((req, res) => {
	var data = ''
	req.on('data', (chunk) => {
		data += chunk
	})
	req.on('end', () => {
		var _data = {}
		data = JSON.parse(data)
		Object.keys(data).forEach((item, index) => {
			if(item !== 'url') {
				_data[item] = data[item]
			}
		})
		superagent.post(data.url)
			.query(_data)
			.end((err, obj) => {
				res.end(unescape(obj.text.replace(/\\u/g, '%u')))
			})
	})
}).listen(9088)