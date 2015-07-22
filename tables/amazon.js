var mongojs=require('../mongo.js').mongojs;
var db=require('../mongo.js').db;


var table = db.collection("AmazonProduct");


exports.findAll = function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	console.log(req.query);
	table.find().limit(20).sort({postedOn : -1} , function(err , success){
		console.log('Response success '+success);
		console.log('Response error '+err);
		if(success){
			res.status(200).send("{\"currentPage\": 2,\"pageSize\": 12,\"total\": 45,\"predicate\": \"comprehensive\",\"items\": [	{\"pid\" : 1,\"thumbnail\": \"http://img11.360buyimg.com/n7/jfs/t277/193/1005339798/768456/29136988/542d0798N19d42ce3.jpg\",\"logo\": \"1号店\",\"name\": \"苹果Apple 【1号海购】港版 iPhone 6 plus 4G手机 5.5英寸 A1524 GSM/WCDMA/TD-LTE(金色)\",\"price\": 5469.00,\"source\": \"第三方\",\"sales\" : 400,\"directPost\": \"是\",\"storage\": 200,\"updateTime\": \"2小时\",\"comments\" : 1,\"comprehensive\":12}]}");
		}else{
		}
		
	});
	
}

exports.find = function (req, res , next){
	res.setHeader('Access-Control-Allow-Origin','*');
	table.findOne({_id:mongojs.ObjectId(req.params.id)} , function(err , success){
		console.log('Response success '+success);
		console.log('Response error '+err);
		if(success){
			res.send(200 , success);
			return next();
		}
		return next(err);
	})
}

