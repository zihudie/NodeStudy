// const http = require('http');
//
// const server = http.createServer((req, res) => {
//   // req 是 http.IncomingMessage 的实例，这是一个 Readable Stream
//   // res 是 http.ServerResponse 的实例，这是一个 Writable Stream
//
//   let body = '';
//   // 接收数据为 utf8 字符串，
//   // 如果没有设置字符编码，将接收到 Buffer 对象。
//   // req.setEncoding('utf8');
//
//   // 如果监听了 'data' 事件，Readable streams 触发 'data' 事件
//   req.on('data', (chunk) => {
//     body += chunk;
//   });
//
//   // end 事件表明整个 body 都接收完毕了, 先将数据存储到buffer，再从buffer流出，防止一下子读入过大数据内存不够
//   req.on('end', () => {
//       const data = JSON.parse(body);
//       // 发送一些信息给用户
//       console.log(body)
//       res.write(data);
//       res.end();
//   });
// });
//
// server.listen(1337);
const fs = require('fs');
const rr = fs.createReadStream('./test.txt');
const writable = fs.createWriteStream('./file1.txt');
var body
rr.on('readable', () => {
  var chunk = rr.read()
})
//可以从源数据抽取可读流，但不推荐如此使用，但看起来读取的不是buffer
rr.on('data', (chunk) => {
  console.log('readable:', chunk.length);
  console.log(`Received ${chunk.length} bytes of data.`);
  body += chunk
});
//执行了监听了data自动读取源数据，被抽调走，read再读取就读取不到了
//这种方式提取的chunk有最高阈值应该可以设定吧 测试为65536
//读取chunk为buffer
writable.on('pipe', (src) => {
  console.log('监听到了正在传输流')
});
//监听事件只触发一次，应该隐式分段读写
rr.pipe(writable);
rr.unpipe(writable); //读入的流会被删除
// 这种方式拿不到中间读取数据
// rr.on('end', () => {
//   console.log('body', writable.length);
// });
