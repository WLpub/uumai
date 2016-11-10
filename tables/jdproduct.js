var mongojs=require('../mongo.js').mongojs;
var db=require('../mongo.js').db;


var table = db.collection("uumai_ui_jd_product");


exports.findAll = function(req, res , next){
	res.setHeader('Access-Control-Allow-Origin','*');
	table.find().limit(100).sort({postedOn : -1} , function(err , success){
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


exports.findByCategory = function(req, res , next){
	console.log('params category '+req.params.category);
	
	res.setHeader('Access-Control-Allow-Origin','*');
	table.find({category:req.params.category}).limit(100).sort({postedOn : -1} , function(err , success){

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

