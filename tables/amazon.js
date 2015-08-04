var mongojs=require('../mongo.js').mongojs;
var db=require('../mongo.js').db;


var table = db.collection("AmazonProduct");


exports.findAll = function(req, res){

	//http://localhost:8080/list?currentPage=1&filterText=&mailToChina=0&orderByText=comprehensive&searchWords=xxx

	res.setHeader('Access-Control-Allow-Origin','*');

	if(req.query.searchWords=="")
		return;

    console.log('searchWords:'+req.query.searchWords);
	var strs= new Array(); //定义一数组 
	strs=req.query.searchWords.split(" "); //字符分割 
	var sql={};
 	sql.$and=[];
	for (i=0;i<strs.length ;i++ ) 
	{ 
	    var searchexpress= {'title':{$regex:strs[i],$options: 'i'}};
	    console.log('searchexpress:'+strs[i]);
 		sql.$and.push(searchexpress);	  ; //分割后的字符输出 
	} 

	//var sql={'title':{$regex:req.query.searchWords,$options: 'i'}};
 	
	if(req.query.mailToChina==1)
		sql.shiptochina="ship to china";

	if(req.query.filterText==1||req.query.filterText==3||req.query.filterText==6){
		console.log('sql.ismixprice:'+sql.ismixprice);
		sql.ismixprice=eval(req.query.filterText);
	}


 	// var jsonString = "{\"title\": {\"$regex\": \" "+req.query.searchWords+"\"}}";
	// var jsonObj = JSON.parse(jsonString);
 
  	
 	var page=(req.query.currentPage-1)*20;

   	table.find(sql).count(function (e, count) {
		 console.log('count:'+count);

 	        var ret={};
	       	ret.total=count;
	       	ret.items=[];
	       	table.find(sql).limit(20).skip(page, function(err, docs) { 

	       		if(docs){
	       			docs.forEach(function(doc) {
 
 		 			var record={};
		 			record.pid=doc._id;
		 			record.thumbnail=doc.imgsrc;
		 			record.bigimgsrc=doc.bigimgsrc;
		 			if(doc.title.length>40){
		 				record.name=doc.title.substring(0,40)+"...";
		 			}else{
		 				record.name=doc.title;
		 			}
		 			record.brand=doc.brand;
		 			if(doc.inStock){
		 					var instock= doc.inStock.trim()=="In Stock."?"现货":doc.inStock;
		 					if(instock.indexOf("In stock but may require an extra")>=0){
		 						instock="期货";
		 					}
		 					if(instock.indexOf("left in stock")>=0){
		 						var instockstr=instock.split(" ");
		 						instock=instockstr[2];
		 					} 
		 					record.instock = instock;
		 			}
		 			record.listprice =doc.listprice;
		 			record.price=doc.price ;  //Number(!!doc.price?doc.price.substring(1):'');
		 			record.directPost= doc.shiptochina=="ship to china"? "直邮":"";
		 			record.ziying = doc.merchantID == "ATVPDKIKX0DER" ? "自营":"";
		 			record.quxian = "3" ;
		 			record.star= doc.star;
		 			record.updatetime="2015-07-18"; //doc.updatetime;
		 			if(doc.customerreviews){
		 				record.customerreviews = doc.customerreviews.replace('customer reviews', '').replace('customer review', '').trim();
		 		    }
		 			record.url=doc.url;

		            ret.items.push(record);
		            });

		            res.status(200).send(ret).end();
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

exports.find = function (req, res){
	console.log('id:'+req.params.id);
	res.setHeader('Access-Control-Allow-Origin','*');
	table.findOne({_id:mongojs.ObjectId(req.params.id)} , function(err , doc){
 		if(doc){
 					//console.log('title:'+doc.title);
		 			var record={};
		 			record.pid=doc._id;
		 			record.imgsrc=doc.imgsrc;
		 			record.imgurl=doc.bigimgsrc;
		 			record.name=doc.title;
		 			record.listprice=doc.listprice;
		 			record.price=doc.price ? doc.price.substring(1): "";
		 			record.outLink=doc.url;
		 			record.inStock=doc.inStock;
		 			record.brand=doc.brand;
		 			record.ziying= doc.merchantID == "ATVPDKIKX0DER" ? "自营":"";
		 			record.storeID=doc.storeID;
		 			record.directPost= doc.shiptochina=="ship to china"? "直邮":"";
		 			record.updatetime=doc.updatetime;
		 			record.category=doc.category;
		 			record.star=doc.star;
		 			record.bestrank= doc.bestrank;
		 			record.customerreviews=doc.customerreviews;
		 			record.ismixprice=doc.ismixprice;
		 			record.description=doc.description;
		 			//record.directPost= doc.shiptochina=="ship to china"? "直邮":"";
		 			//record.ziying = doc.merchantID == "ATVPDKIKX0DER" ? "自营":"";
		 			//record.quxian = "3" ;
		 			record.priceTrend=doc.priceTrend;
					res.status(200).send(record).end(); 
 		}
 	})

}

