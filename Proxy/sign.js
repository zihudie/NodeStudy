/*
1、老虎sdk登录签名
2、论坛签名
*/
var md5 = require('md5')

var appkey10020 = 'uEvdTDXx7q1mtFwk9pHGNCXb1JilUKTP'
var appkey1000 = '54f4dfb8d47a015ccdb5f60a5b750483'
function sign(data, type) {
	
	if(type === 'login') {
		var signArr = ["appId", "username", "password", "deviceId", "deviceType", "deviceName", "channelId", "t"].sort()
		return md5(getStr(signArr, data))
	}
	if(type === 'bbs'){
		var signArr = ['access_token', 'app_id', 'channelId', 'deviceId', 'mac', 'openudid', 't', 'user_id', 'vendorid']
		return md5(getStr(signArr, data))
	}
}
function getStr(signArr, signData) {
	var signStr = ""
	signArr.forEach((obj) => {
		Object.keys(signData).forEach((item) => {
			if(item === obj) {
				signStr += signData[item]
			}
		})
	})
	signStr += appkey10020
	return signStr
}

exports.sign = sign