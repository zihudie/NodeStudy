var superagent = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')
const server = http.createServer((req, res) => {
  // 并发连接数的计数器
  var concurrencyCount = 0;
  var fetchUrl = function (offset, callback) {
    // delay 的值在 2000 以内，是个随机的整数
    var delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    console.log('现在的并发数是', concurrencyCount)
    var params = {
      'offset':offset,
      'type':'day'
    }
    superagent.get('http://www.zhihu.com/node/ExploreAnswerListV2')
          .set({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Referrer': 'www.baidu.com'
          })
          .query({
            params: JSON.stringify(params)
          })
          .end(function(err, obj) {
            if(err) return null
            var $ = cheerio.load(obj.text)
            var items = []
            var baseUrl = 'https://www.zhihu.com'
            $('.explore-feed').each(function (idx, element) {
              var $element = $(element)
              var tittle = $element.find('h2 a').text().replace(/[\r\n]/g, '')
              var href = url.resolve(baseUrl, $element.find('h2 a').attr('href'))
              var vote = $element.find('.zm-item-vote a').text()
              var author = $element.find('.author-link').text()
              items.push({
                title: tittle,
                href: href,
                vote: vote,
                author: author
              })
            })
            // res.end(JSON.stringify(items))
            concurrencyCount--
            console.log('释放了并发数后，当前并发数', concurrencyCount)
            callback(null, JSON.stringify(items))
          })
  };
  var offsets = [];
  for(var i = 0; i < 13; i++) {
    offsets.push(i * 5);
  }
  async.mapLimit(offsets, 5, function (offset, callback) {
    fetchUrl(offset, callback);
  }, function (err, result) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf8' });
    console.log(result.length)
    res.end(JSON.stringify(result))
  });
}).listen(9090)
