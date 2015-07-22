var mongojs=require('../mongo.js').mongojs;
var db=require('../mongo.js').db;


var table = db.collection("AmazonProduct");


exports.findAll = function(req, res){

	//http://localhost:8080/list?currentPage=1&filterText=&mailToChina=0&orderByText=comprehensive&searchWords=xxx

	res.setHeader('Access-Control-Allow-Origin','*');

	var sql={'title':{$regex:req.query.searchWords}};
	
	if(req.query.mailToChina==1)
		sql.shiptochina="ship to china";
 
  
	// var jsonString = "{\"title\": {\"$regex\": \" "+req.query.searchWords+"\"}}";
	// var jsonObj = JSON.parse(jsonString);
 
  	
 	var page=(req.query.currentPage-1)*20;

   	table.find(sql).count(function (e, count) {

 	        var ret={};
	       	ret.total=count;
	       	ret.items=[];
	       	table.find(sql).limit(20).skip(page, function(err, docs) { 

	       		if(docs){
	       			docs.forEach(function(doc) {
 
 		 			var record={};
		 			record.pid=doc._id;
		 			record.thumbnail=doc.imgsrc;
		 			record.name=doc.title;
		 			record.price=doc.price.substring(1);


		            ret.items.push(record);
		            });

		            res.status(200).send(ret);
	       		}

 		     });
 
 		     

 	});


 

 	// res.setHeader('Access-Control-Allow-Origin','*');
	// console.log(req.query);
	// table.find().limit(20).sort({postedOn : -1} , function(err , success){
	// 	console.log('Response success '+success);
	// 	console.log('Response error '+err);
	// 	if(success){
	// 	}else{
	// 	}
		
	// });
	
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

