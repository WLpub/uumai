var mongojs=require('../mongo.js').mongojs;
var db=require('../mongo.js').db;


var table = db.collection("AmazonProduct");


exports.findAll = function(req, res , next){
	res.setHeader('Access-Control-Allow-Origin','*');
	table.find().limit(20).sort({postedOn : -1} , function(err , success){
		console.log('Response success '+success);
		console.log('Response error '+err);
		if(success){
			res.send(200 , success);
			return next();
		}else{
			return next(err);
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

