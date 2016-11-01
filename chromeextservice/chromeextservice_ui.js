exports.gethtml = function(req, res){

	//console.log(req.query.traceurl);
	var url=decodeURI(req.query.traceurl);
	//console.log(url);
 	if(url.indexOf("item.jd.com")!=-1){
 		var productid=url.substring(19,url.indexOf(".html"));
 		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/jd/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("product.dangdang.com")!=-1){
		var productid=url.substring(28,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img  onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/dangdang/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("item.gome.com.cn")!=-1){
		var productid=url.substring(24,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/gome/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("product.suning.com")!=-1){
		var productid=url.substring(26,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/suning/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml)
;	} else if (url.indexOf("item.yhd.com")!=-1){
		var productid=url.substring(25,url.indexOf("?"));
		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/yhd/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("item.yixun.com")!=-1){
		var productid=url.substring(27,url.indexOf(".html"));
		//console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/yixun/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("amazon.cn")!=-1){
		var productid=url.substring(url.indexOf("/dp/")+4,url.indexOf("/dp/")+14);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/amazoncn/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	} else if (url.indexOf("drugstore.com")!=-1){
		var productid;
		if(url.indexOf("pid")>0){
			url=url.substring(url.indexOf("pid="),url.length-1);
			productid=url.substring(url.indexOf("pid=")+4,url.indexOf("&"));
		}else if(url.indexOf("/qxp")>0){
			url=url.substring(url.indexOf("/qxp"),url.length-1);
			productid=url.substring(url.indexOf("/qxp")+4,url.indexOf("?"));
		}		
		// console.log(productid);
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img onerror="this.onerror=null;this.src=\'//www.uumai.net/images/notfound.jpg\';" height="210" width="560" src="//www.uumai.net/images/uumai/drugstore/' +productid+ '.png" alt=""></a></div>' ;
		res.status(200);
		res.send(initHtml);
	}  else {
		var initHtml= '<div><a href="//www.uumai.net" target="_blank"><img height="210" width="560" src="/images/404.jpg"></a></div>' ;
		res.status(200);
		res.send(initHtml);		
	}
	 
	
}

 