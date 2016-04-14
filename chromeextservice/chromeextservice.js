exports.gethtml = function(req, res){
	var url=decodeURI(req.query.traceurl);
	// console.log(url);
 	if(url.indexOf("item.jd.com")!=-1){
 		var productid=url.substring(19,url.indexOf(".html"));
 		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/jd/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("product.dangdang.com")!=-1){
		var productid=url.substring(28,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img  onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/dangdang/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("item.gome.com.cn")!=-1){
		var productid=url.substring(24,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/gome/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("product.suning.com")!=-1){
		var productid=url.substring(26,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/suning/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("item.yhd.com")!=-1){
		var productid=url.substring(25,url.indexOf("?"));
		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/yhd/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("item.yixun.com")!=-1){
		var productid=url.substring(27,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/yixun/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("amazon.cn")!=-1){
		var productid=url.substring(url.indexOf("/dp/")+4,url.indexOf("/dp/")+14);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/amazoncn/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("drugstore.com")!=-1){
		var productid=url.substring(url.indexOf("qxp")+3,url.indexOf("?"));
		// console.log(productid);
		var initHtml= '<div><a href="http://www.uumai.net" target="_blank"><img onerror="javascript:this.style.display=\'none\'" height="210" width="560" src="http://www.uumai.net/images/uumai/drugstore/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	}  else {
		res.status(404);
	}
	 
	
}

 