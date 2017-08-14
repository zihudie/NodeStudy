var http = require('http')
var url = require('url')
var async = require('async')
var querystring = require('querystring')
var superagent = require('superagent')
var md5 = require('md5')

var server = http.createServer((req, res) => {
	//无ui界面预置登录请求，用来获取之后数据，当前所在环境为测试环境
	function parseUrl(query) {
		if(!query) return null
		var arr = query.split('&')
		var	obj = {}
		arr.forEach((item) => {
			obj[item.split('=')[0]] = item.split('=')[1]
		})
		return obj
	}
	var query = parseUrl(url.parse(req.url).query)
	function getData(data, repeatObj) {
		var obj = {}
		data.forEach((item, index) => {
			obj[item.key] = item.value
			if(repeatObj) {
				repeatObj.forEach((item, index) => {
					if(item.key === item.key) {
						obj[item.key] = item.value
					}
				})
			}
		})
		return obj
	}
	function login(cb) {
		var data = [{"key":"appId","value":"10020","description":""},{"key":"username","value":"15116936473","description":""},{"key":"password","value":"123456","description":""},{"key":"deviceId","value":"8D2A96A8-1C5F-46DA-AFAA-20C58F10CEA0","description":""},{"key":"deviceType","value":"ios","description":""},{"key":"deviceName","value":"an","description":""},{"key":"channelId","value":"1","description":""},{"key":"t","value":"1502076276409","description":""},{"key":"sign","value":"3d7b2a0a7057320edf366b60606ab666","description":""}]
		var baseUrl = 'user.laohu.com/m/newApi/login'
		superagent.post(baseUrl)
			.query(getData(data))
			.end((err, obj) => {
				if(err) return null
				var data = JSON.parse(obj.text)
				if(data.code == 0) {
					cb(null, data.result.token)
				} else {
					cb('login fail')
				}
				
			})

	}
	
	function search(access_toekn, cb) {
		console.log('access_toekn', access_toekn)
		var appkey10020 = 'uEvdTDXx7q1mtFwk9pHGNCXb1JilUKTP'
		var str = ''
		var arr = ['access_token', 'app_id', 'channelId', 'deviceId', 'mac', 'openudid', 't', 'user_id', 'vendorid']
		var post = [{"key":"module","value":query.module,"description":""},{"key":"app_id","value":"10020","description":""},{"key":"user_id","value":query.uid,"description":""},{"key":"access_token","value":"e55083afabcb4fd9ba632409da8d7245","description":""},{"key":"sign","value":"9a0480cc5a4acc9d8d580f62d9249994","description":""},{"key":"version","value":"2","description":""},{"key":"bind_fids","value":"20","description":""},{"key":"downoffset","value":"0","description":""},{"key":"adid","value":"8D2A96A8-1C5F-46DA-AFAA-20C58F10CEA0","description":""},{"key":"appversion","value":"6.0.0","description":""},{"key":"centertype","value":"new","description":""},{"key":"channelId","value":"1","description":""},{"key":"fid","value":"2","description":""},{"key":"mac","value":"d41d8cd98f00b204e9800998ecf8427edae2d80d","description":""},{"key":"openudid","value":"d41d8cd98f00b204e9800998ecf8427edae2d80d","description":""},{"key":"os_type","value":"ios","description":""},{"key":"sort_type","value":"1","description":""},{"key":"type","value":"1","description":""},{"key":"vendorid","value":"C901C948-70C8-4B0E-8272-D756E2AFF8A9","description":""},{"key":"deviceId","value":"8D2A96A8-1C5F-46DA-AFAA-20C58F10CEA0","description":""}]
		arr.forEach((item, index) => {
		  post.forEach((obj, index) => {
		    if(item === obj.key) {
		    	if(obj.key === 'access_token') {
		    		if(access_toekn !== obj.value) {
		    			str += access_toekn
		    		} else {
		    			str += obj.value
		    		}
		    	} else {
		    		str += obj.value
		    	} 
		    }
		  })
		})
		str += appkey10020
		var md5Str = md5(str)
		console.log('md5Str', md5Str)
		var baseUrl = 'bbs-dev.laohu.com/api/laohuapp/index.php'
		superagent.post(baseUrl)
			.query(getData(post, [{key: 'sign', value: md5Str}, {key: 'access_token', value: access_toekn}]))
			.end((err, obj) => {
				if(err) return null
				var data = JSON.parse(obj.text)
				res.end(unescape(obj.text.replace(/\\u/g, '%u')))
			})
	}
	async.waterfall([
		function(cb) {
			login(cb)
		},
		function(n, cb) {
			search(n, cb)
		}
	], 
	function(err, result) {
		if(err) {
			console.log('err:', err)
		} else {
			console.log('result', result)
		}
	})

}).listen(9000)