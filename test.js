var superagent = require('superagent')

superagent.get('http://127.0.0.1:9000/userthreadflow')
	.end((err, obj) => {
		console.log(obj.text)
	})