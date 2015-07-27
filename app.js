var express = require('express');
var path = require('path');
var http = require('http');
var url = require('url');
var app = express();

app.set('port',process.env.PORT||8080);
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

var amazon=require('./tables/amazon.js');
var xueqiu=require('./tables/xueqiu.js');
//app.get('/amazons', amazon.findAll);
//app.get('/amazons' +'/:id', amazon.find);
//app.get('/xueqius', xueqiu.findAll);
//app.get('/xueqius' +'/:id', xueqiu.find);

app.get('/list',function(req,res){
  	amazon.findAll(req,res);
	//res.send("{\"currentPage\": 2,\"pageSize\": 12,\"total\": 45,\"predicate\": \"comprehensive\",\"items\": [	{\"pid\" : 1,\"thumbnail\": \"http://img11.360buyimg.com/n7/jfs/t277/193/1005339798/768456/29136988/542d0798N19d42ce3.jpg\",\"logo\": \"1号店\",\"name\": \"苹果Apple 【1号海购】港版 iPhone 6 plus 4G手机 5.5英寸 A1524 GSM/WCDMA/TD-LTE(金色)\",\"price\": 5469.00,\"source\": \"第三方\",\"sales\" : 400,\"directPost\": \"是\",\"storage\": 200,\"updateTime\": \"2小时\",\"comments\" : 1,\"comprehensive\":12}]}");
});

app.get('/detail' +'/:id', amazon.find);

app.get('/app',function(req,res){
	res.sendFile(path.join(__dirname,'/index.html'));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})