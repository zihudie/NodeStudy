const http = require('http')
const url = require('url')
let server = http.createServer((req, res) => {
  req.cookie = cookieParse(req.headers.cookie)
  isLogin(req, res)
}).listen(9090)

let isLogin = (req, res)=> {
  if(req.cookie.isLogin) {
    res.writeHead(200)
    res.end('hello world again')
  } else {
    let option = {
      'Path': '/',
      'Max-Age': 3,
    }
    res.setHeader('Set-Cookie', setCookie('isLogin', true, option))
    res.writeHead(200)
    res.end('hello world first')
  }
}
let cookieParse = (cookie) => {
  let cookieResult = {}
  if(!cookie) return cookieResult
  let cookieList = cookie.split(';')
  cookieList.forEach((item) => {
    let keyValue = item.split('=')
    let key = keyValue[0]
    cookieResult[key] = keyValue[1]
  })
  return cookieResult
}
let setCookie = (name, value, option) => {
  option = option || {}
  let cookieValue = [name + '=' + value]
  Object.keys(option).forEach((item) => {
    cookieValue.push(item + '=' + option[item])
  })
  return cookieValue.join(';')


}
