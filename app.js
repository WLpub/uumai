var fs = require('fs');
var express = require('express');
var path = require('path');
var http = require('http');
var url = require('url');
var app = express();
var superagent = require('superagent');
var bodyParser = require('body-parser');

var https = require('https');

var options = {
   key  : fs.readFileSync('server.key'),
   cert : fs.readFileSync('server.crt')
};

app.set('port',process.env.PORT||8080);

app.set('httpsport',process.env.HTTPSPORT||8443);

app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

//var amazon=require('./tables/amazon.js');
//var xueqiu=require('./tables/xueqiu.js');
var jdcategory=require('./tables/jdcategory.js');
var jdproduct=require('./tables/jdproduct.js');

var chromeextservice=require('./chromeextservice/chromeextservice.js');
var chromeextservice_ui=require('./chromeextservice/chromeextservice_ui.js');

// app.get('/detail/:id',function(req,res){
// 	amazon.find(req,res);
// });
 
// app.get('/list',function(req,res){
//   	amazon.findAll(req,res);
// });

//jd
app.get('/jd/cateList/',function(req,res){
  //res.status(200).send([{'name':'category1'},{'name':'category2'}]).end();
   jdcategory.findAll(req,res);
});

app.get('/jd/productList/:category',function(req,res){
  //res.status(200).send([{'name':'xxxx','category':'category1'},{'name':'aaa','category':'category1'}]).end();
   jdproduct.findByCategory(req,res);
});


//chrome plugin
app.get('/chromeextservice',function(req,res){
  	chromeextservice.gethtml(req,res);
});

app.get('/chromeextserviceui',function(req,res){
  	chromeextservice_ui.gethtml(req,res);
});

// app.get('/shopList/',function(req,res){
// 	//amazon.findshopList(req,res);
// 	res.status(200).send(['JD','taobao','amazon','apple','suning']).end();
// });
  
app.get('/feedback/:word',function(req,res){
	var sys = require('sys'); 
	sys.debug("feedback!"); 
	res.status(200).end("success!");
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'/index.html'));
});

// app.get('/uudata',function(req,res){
// 	res.sendFile(path.join(__dirname,'/uudata/index.html'));
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/search', function (req, res) {   
	// console.log(req.body);
    var sreq = superagent.post('http://10.182.111.82:9200/uumaiproduct_index/uumaiproduct/_search').send(req.body);
    sreq.pipe(res);
    sreq.on('end', function(){
        //console.log('done');
    });
});

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    //res.render('404', { url: req.url });
    res.sendFile(__dirname + '/404.html');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})

https.createServer(options, app).listen(app.get('httpsport'), function () {
   console.log('Express https server listening on port ' + app.get('httpsport'));
});