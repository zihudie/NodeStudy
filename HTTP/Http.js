// const http = require('http')
// const url = require('url')
// const querystring = require('querystring')
// var today = new Date()
// var UTCstring = today.toUTCString()
// //server
// var server = http.createServer(function(request, response) { //回调函数是http.Server类的对象中request的事件
//   // request http.IncomingMessage类的实例，实现了可读流
//   // response http.ServerResponse类的实例
//   response.setHeader('Last-Modified', UTCstring)
//   response.setHeader('Max-Age', 315360000)
//   response.end('123')
//   console.log('request.headers', request.headers)
// }) //server 为http.Server的实例
// server.listen(9090)
//
// const options = {
//   hostname: '127.0.01',
//   port: 9090,
//   method: 'GET',
//   headers: {
//     'If-Modified-Since': UTCstring,
//   }
// };
// const req = http.request(options, function(res) {
//   console.log(`状态码: ${res.statusCode}`)
//   console.log(`响应头: ${JSON.stringify(res.headers)}`)
//   res.setEncoding('utf8')
//   res.on('data', (chunk) => {
//     console.log(`响应主体: ${chunk}`)
//   })
//   res.on('end', () => {
//     console.log('响应中已无数据。')
//   })
// })
// req.on('error', (e) => {
//   console.error(`请求遇到问题: ${e.message}`)
// })
// req.end()

var http = require("http");
var fs   = require("fs");
var url  = require("url");
var querystring = require("querystring");

http.createServer(function(req,res){
    var gurl = req.url,
        pathname = url.parse(gurl).pathname;
    if(pathname.indexOf("/static/")==0){
        var realPath = __dirname + pathname;
        dealWithStatic(pathname,realPath,res,req);
        console.log()
        return;
    }
}).listen(5555);

function dealWithStatic(pathname,realPath,res,req){
    fs.access(realPath, fs.constants.R_OK, function(err){
        if(err){
          console.log(err)
            res.writeHead(404,{
                "Content-Type" : "text/html"
            });
            res.end("not find!!!");
        }else{
            var mmieString = /\.([a-z]+$)/i.exec(pathname)[1],
                cacheTime  = 20,
                mmieType;
            switch(mmieString){
                case "html" :
                case "htm"  :
                case "xml"  : mmieType = "text/html";
                break;
                case "css"  : mmieType = "text/css";
                break;
                case "js"   : mmieType = "text/plain";
                break;
                case "png"  : mmiType  = "image/png";
                break;
                case "jpg"  : mmiType  = "image/jpeg";
                break;
                default     : mmieType = "text/plain";
            }

            var fileInfo      = fs.statSync(realPath), //文件信息
                lastModied    = fileInfo.mtime.toUTCString(),
                modifiedSince = req.headers['if-modified-since']
                // console.log();
            if(modifiedSince && lastModied == modifiedSince){
                res.writeHead(304,"Not Modified");
                res.end();
                return;
            }

            fs.readFile(realPath,function(err,file){
                if(err){
                    res.writeHead(500,{
                        "Content-Type" : "text/plain"
                    });
                    res.end(err);
                }else{
                    var d = new Date();
                    var expires = new Date(d.getTime()+10*60*1000);
                    console.log(new Date(d.getTime()))
                    res.writeHead(200,{
                        "Content-Type"  : mmieType,
                        "Expires"       : expires.toUTCString(),
                        "Cache-Control" : "max-age=" + cacheTime,
                        "Last-Modified" : lastModied
                    });
                    res.end(file);
                }
            });
        }
    });
}
