/*
他人帖子列表配置页
*/
var http = require('http')
var superagent = require('superagent')
var url = require('url');
var { userthreadflow, login } = require('./requestOptions.js');
var { sign } = require('./sign.js')
var hostUrl = '127.0.0.1:9088'

var server = http.createServer((req, res) => {
	var pathname = url.parse(req.url).pathname	
	switch(pathname) {
		case '/userthreadflow':
				proxyHost(userthreadflow, true, res)
			break
	}
}).listen(3000)
function proxyHost(data, isNeedSign, res) {
	if(isNeedSign) {
		login['sign'] = sign(login, 'login')
		superagent.post(hostUrl)
		.send(login)
		.end((err, obj) => {
			if(err) console.log(err)
				if(JSON.parse(obj.text).code === 0) {
					var token = JSON.parse(obj.text).result.token
					data['access_token'] = token
					data['sign'] = sign(data, 'bbs')
					superagent.post(hostUrl)
						.send(data)
						.end((err, obj) => {
							res.end(obj.text)
						})
				} else {
					console.log('请求失败:', JSON.parse(obj.text).message)
				}
			
			
		})
	} else {
		
	}
	
}
proxyHost()