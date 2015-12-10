var express = require('express');
var path = require('path');
var http = require('http');
var url = require('url');
var app = express();
var superagent = require('superagent');
var bodyParser = require('body-parser');



app.set('port',process.env.PORT||8080);
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

var amazon=require('./tables/amazon.js');
var xueqiu=require('./tables/xueqiu.js');

app.get('/detail/:id',function(req,res){
	amazon.find(req,res);
});
 
app.get('/list',function(req,res){
  	amazon.findAll(req,res);
});

app.get('/cateList/',function(req,res){
	//amazon.findCateList(req,res);
	res.status(200).send([{'name':'电脑','count':10},{'name':'mac','count':1000}]).end();
});

app.get('/shopList/',function(req,res){
	//amazon.findshopList(req,res);
	res.status(200).send(['JD','taobao','amazon','apple','suning']).end();
});

app.get('/feedback/:word',function(req,res){
	var sys = require('sys'); 
	sys.debug("feedback!"); 
	res.status(200).end("success!");
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'/index.html'));
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/search', function (req, res) {   
	console.log(req.body);
    var sreq = superagent.post('http://10.182.111.208:9200/uumaiproduct_index/uumaiproduct/_search').send(req.body);
    sreq.pipe(res);
    sreq.on('end', function(){
        //console.log('done');
    });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})

