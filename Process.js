console.log('process.env', process.env) //打印用户环境信息
console.log('process.argv', process.argv)
process.argv [ '/usr/local/bin/node',
'/Users/WangJie/Desktop/workspace/nodeStudy/Process.js',
'-a',
'--vde' ]
// 参数0：启动进程的绝对路径、参数1：当前执行的JavaScript文件路径、other参数：命令行参数
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
process.stdin.pipe(process.stdout)
//以此实现一个命令行工具
