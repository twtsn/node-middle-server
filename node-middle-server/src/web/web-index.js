var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
   res.send('Hello World');
})
 
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
process.on('uncaughtException',function () {});// 捕获进程错误 保证异常时node不会停止