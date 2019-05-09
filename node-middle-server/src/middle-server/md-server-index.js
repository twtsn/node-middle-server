var express = require('express');
var request = require('request');
const superagent = require('superagent');
var bodyParser = require("body-parser"); 
request = request.defaults({jar: true}) 
var app = express();
var serverPath = 'http://localhost:3002';
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

app.get('/api/list', function (req, res) {
	getMoreData(req.query, req).then((data) => {
		res.json(data);
	});
   // res.redirect('http://localhost:3002/list1?test=123');
})
 
var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
process.on('uncaughtException',function () {});// 捕获进程错误 保证异常时node不会停止

async function getMoreData(paramsObj, req){
	var queryStr = formatterUrlParams(paramsObj);
	var url01 = serverPath + '/api/list1?' + queryStr;
	var url02 = serverPath + '/api/list2?' + queryStr;
	var data01 = await httpGet(url01, req) || [];
	var data02 = await httpGet(url02, req);
	return data01.concat(data02);
}
function httpGet(url, req){
	return new Promise((resolve, reject) => {
		request({
			url: url,
			method: "get",
			json: true,
			headers:{
				cookie: req.headers.cookie
			}
		}, function (error, response, body) {
		  if (!error && response.statusCode == 200 && body.code === 200) {
			resolve(body.data) // 请求成功的处理逻辑
		  } else {
			  console.info('error', error);
			reject(error);
		  }
		});
	});
}
function formatterUrlParams(paramsObj){
	let queryArr = [];
	for(var key in paramsObj){
		queryArr.push(`${key}=${paramsObj[key]}`);
	}
	return queryArr.join('&');
}