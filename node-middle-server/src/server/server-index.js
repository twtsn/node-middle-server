var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');

app.use(session({
    secret: 'asdas',
    resave: false,
    saveUninitialized: true,
    cookie: { 
		
		secure: false
	}
}));

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin",req.headers.origin);         //允许的来源
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers","Content-Type");    //请求的头部
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  //允许请求的方法
  next();
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('/api/*', function (req, res, next) {

   if(req.session.user){
		next();
	} else {
		res.json({
			code: 401,
			message: '未登录'
		});
	}
})

app.get('/api/loginUser', function(req, res, next) {
   res.json({
			code: 200,
			data: req.session.user
	});
});
app.post('/login', function(req, res, next) {
    var user={
          name: req.body.name,
          pwd: req.body.pwd
    }
    req.session.user = user;
	console.info('res.session.user', req.headers.cookie);
    res.json({
		code: 200,
		message: '已登录',
		data:user
	})
});
app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.json({
			code: 200,
			message: '注销成功'
		});
	})
});
app.get('/api/list1', function (req, res) {
   var data = [];
	for(var i = 1 ; i <=10 ; i++){
		data.push({
			name: `name${i}`,
			age: i + 10
		});
	}
   res.json({
	   code: 200,
	   data: data
   });
})
app.get('/api/list2', function (req, res) {
   var data = [];
	for(var i = 10 ; i <=20 ; i++){
		data.push({
			name: `name${i}`,
			age: i + 10
		});
	}
    res.json({
	   code: 200,
	   data: data
   });
})

var server = app.listen(3002, function () {

  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
process.on('uncaughtException',function () {});// 捕获进程错误 保证异常时node不会停止