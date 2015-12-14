(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.constant('goodsOrderActiveClass', 'btn-success')
		.constant('goodsViewActiveClass', 'orange')
		.controller('ListCtrl', ListCtrl);

	function ListCtrl($scope, $http, $rootScope, goodsOrderActiveClass, goodsViewActiveClass){
		$scope.goodsOrder = [{
			type: "category_quanzhong",
			name: "综合排序"
		},{
			type: "price",
			name: "价格"
		},{
			type: "customerreview",
			name: "评论数"
		}];
		
		$scope.resetOrder = function(order){
			if( $scope.predicate == order){
				$scope.predicate = "-" + order;
			}else{
				$scope.predicate = order;
			}
			$scope.changeFilter();
		};
		$scope.setSelectedClass = function(type){
			if ( $scope.predicate == type || $scope.predicate == "-"+type ){
				return goodsOrderActiveClass;
			}else{
				return "";
			}
		};

		//list or table
		$scope.showBlock = false;
		$scope.showList = true;
		$scope.showFeedBack = false;
		$scope.viewType = "list";
		$scope.showGoods = function(type){
			if(!!!$scope.total){
				$scope.showBlock = false;
				$scope.showList = false;
				$scope.showFeedBack = true;
				return;
			}
			if( type == "block" ){
				$scope.showBlock = true;
				$scope.showList = false;
				$scope.showFeedBack = false;
				$scope.viewType = "block";
			}else{
				$scope.showBlock = false;
				$scope.showList = true;
				$scope.showFeedBack = false;
				$scope.viewType = "list";
			}
		};
		$scope.setView = function(type){
			return $scope.viewType == type? goodsViewActiveClass : "";
		};

		//get first page data
		//getPageData('data/list.json',[{searchWords : $rootScope.searchWords}]); 
		
		/**
		  * This function used to get the next page data from servers
		  *
		  * @param page      the current page number
		  * @param pageSize  the number of goods show in one page
		  * @param total     the total number of goods which we find in DB
		  *
		  */
		$scope.DoCtrlPagingAct = function(page, pageSize){
			
			$scope.currentPage = page>1?page-1:0;
			$scope.pageSize = pageSize;
			getPageData();
		};
		//search shopCate
		$scope.shopCate = function(){
			if($scope.typePanelClass == "typePanelOpen"){
				getCateList();
			}			
				getShopList();
		};
		
		//search new good
		$scope.searchGoods = function(){
			if($rootScope.searchWords!=$scope.searchWords){
				$scope.shopCate();
				$scope.highFilter = false;
				$scope.lowFilter = null;
				
			}
			$rootScope.searchWords = $scope.searchWords;
			$scope.currentPage = 0;
			getPageData();
		};

		$scope.enterSearchWord = function(event){
			if(event.keyCode !== 13) return;
			$scope.searchGoods();
		};

		//cate $$ shop lists
		$scope.shopList = [];
		$scope.cateList = [];

		//filter && loading Page
		$scope.highFilter = false;
		$scope.lowFilter = null;
		$scope.changeFilter = function(){
			$scope.currentPage = 0;
			getPageData();
		};
		
		$scope.shopShow = false;
		//http request for getting shop list
		var getShopList = function(callback){
			if(!!!($scope.searchWords||$rootScope.searchWords)){
				return;
			}
			var para = {
				  "query":  { 
    		            "match" : { "title" : {
	                            "query":                $scope.searchWords||$rootScope.searchWords||"",
                    	       "minimum_should_match": "75%"
            	          }
                	  }
            	 },
				 "aggs": {
					"website": {
					  "terms": {
						"field": "website"
					  }
					}
				  }
			};
			// console.log(para);
			$.ajax({  
				type:'post',      
				url: 'api/search?search_type=count',
				data:JSON.stringify(para),    
				dataType:'json', 
				contentType: 'application/json',				
				success:function(data){
					$scope.shopList=[];
					for(var i = 0;i<data.aggregations.website.buckets.length;i++){
						$scope.shopList.push({'name':data.aggregations.website.buckets[i].key,'class':$scope.getShopClass(data.aggregations.website.buckets[i].key,true)});
					}
					$scope.$apply();
				}
			});  
		};
		
		//http request for getting cate list
		var getCateList = function(callback){	
			if($scope.typePanelClass == "typePanelClose"){
				return;
			}
			if(!!!($scope.searchWords||$rootScope.searchWords)){
				return;
			}
			var para = {
				"query":  { 
    		            "match" : { "title" : {
	                            "query":                $scope.searchWords||$rootScope.searchWords||"",
                    	       "minimum_should_match": "75%"
            	          }
                	  }
            	 },
			 "sort": [
				{ "category_quanzhong": { "order": "desc" }},
			   "_score"
			   ] ,
				   "aggs": {
					"category": {
					  "terms": {
						"field": "category"
					  }
					}
				  }
			};
			$.ajax({  
				type:'post',      
				url: 'api/search?search_type=count',
				data:JSON.stringify(para),    
				dataType:'json', 
				contentType: 'application/json',		
				success:function(data){  
					$scope.cateList=[];
					for(var i = 0;i<data.aggregations.category.buckets.length;i++){
							$scope.cateList.push($.extend(data.aggregations.category.buckets[i],{'class':''}));
					}
					$scope.$apply();
				}  
			});  
		};
		
		// http request for getting page date
		var getPageData = function(){
			if(!!!$scope.searchWords||!!!$rootScope.searchWords) return;
			var website = [],category=[];
			for(var i in $scope.shopList){
				if($scope.shopList[i]['class'].indexOf('IconL')<0){
					website.push($scope.shopList[i].name);
				}
			}
			for(var j in $scope.cateList){
				if($scope.cateList[j]['class']=='checked'){
					category.push($scope.cateList[j].key);
				}
			}
			var sort  = { "category_quanzhong": { "order": "desc" }};
			switch($scope.predicate){
				case 'category_quanzhong':
				break;
				case '-category_quanzhong':
					sort  = { "category_quanzhong": { "order": "asc" }};
				break;
				case 'price':
					sort  = { "price": { "order": "asc" }};
				break;
				case '-price':
					sort  = { "price": { "order": "desc" }};
				break;
				case 'customerreview':
					sort  = { "customerreview": { "order": "desc" }};
				break;
				case '-customerreview':
					sort  = { "customerreview": { "order": "asc" }};
				break;
			}
			var and = [];
			if(!!!$scope.highFilter){
				and.push({ "terms": { "ziying": [1] }});
			}
			if(!!!$scope.lowFilter){
				and.push({ "terms": { "instock": [1] }});
			}
			if(website.length>0){
				and.push({ "terms": { "website": website}});
			}
			if(category.length>0){
				and.push({ "terms": { "category": category}});
			}
			var para = {
				"from" : $scope.currentPage*20||0,
				"size" : 20,
 				  "query": {
					"filtered": {
						"query":  { 
								"match" : { "title" : {
                            "query":                $rootScope.searchWords,
                           "minimum_should_match": "80%"
                      		}	 
                      		}
						},
						"filter": {
							"and" : and
						 }
					}
				},
				"sort": [
				sort,"_score"
			   ]
			};
			$.ajax({  
				type:'post',      
				url: 'api/search',
				data:JSON.stringify(para),    
				dataType:'json', 
				contentType: 'application/json',		
				success:function(data){
					var goodData = [];
					for(var i = 0;i<data.hits.hits.length;i++) {
						data.hits.hits[i]._source.pid = data.hits.hits[i]._id;
						goodData.push(data.hits.hits[i]._source);
					}	
					$scope.goodBlocks = !!$scope.goodBlocks?$scope.goodBlocks:{};
					$scope.goodBlocks.items = goodData;
					
					$scope.total = data.hits.total;
					
					// init paging
					$scope.searchWords = $rootScope.searchWords;
					
					$scope.showGoods($scope.viewType);

					if(!!!$scope.pageSize){
						$scope.pageSize = 20;
					}
					if(!!!$scope.currentPage){
						$scope.currentPage = 1;
					}
					$scope.dots = "...";
					$scope.adjacent = 2;
					$scope.ulClass = "pagination";
					$scope.activeClass = "active";
					$scope.disabledClass = "disabled";
					$scope.hideIfEmpty = true;
					$scope.scrollTop = true;
					$scope.showPrevNext = false;
					$scope.$apply();
				}
			});  
		};

		// event listener
		$scope.handleEvent = function (e) {
            $scope.data.columnColor = e.type == "mouseover" ? "Green" : "Blue";
		};
		//show typePanel
		$scope.typePanelClass = "typePanelClose";
		$scope.switchPanel = function(){
			$scope.typePanelClass = {"typePanelOpen":"typePanelClose","typePanelClose":"typePanelOpen"}[$scope.typePanelClass];
			getCateList();
		};
		//get shop Class 1，2，3，4，5，6，7    分别代表：amazon,dangdang, gome,jd,suning, yhd, yixun .
		$scope.shopName = {'1':'amazonIcon','2':'dangdangIcon','3':'guomeiIcon','4':'JDIcon','5':'suningIcon','6':'yihaodianIcon','7':'yixunIcon'};
		$scope.getShopClass = function(shop,state){
			var shopClass = {
				'1':{true:'amazonIcon',false:'amazonIconL'},
				'2':{true:'dangdangIcon',false:'dangdangoIconL'},
				'3':{true:'guomeiIcon',false:'guomeiIconL'},
				'4':{true:'JDIcon',false:'JDIconL'},
				'5':{true:'suningIcon',false:'suningIconL'},
				'6':{true:'yihaodianIcon',false:'yihaodianIconL'},
				'7':{true:'yixunIcon',false:'yixunIconL'}};
		
			return shopClass[shop][state];
		};
		
		$scope.switchShop = function(name,classOld,type){
			var length = classOld.length;
			$scope.currentPage = 0;
			if(type==0){
				for(var i=0;i<$scope.shopList.length;i++){
					length = $scope.shopList[i]['class'].length;
					classOld = $scope.shopList[i]['class'];
					$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld.slice(0,length-1):classOld+"L");
				}
				getPageData();
				return;
			}else if(type==1){
				for(var i=0;i<$scope.shopList.length;i++){
					length = $scope.shopList[i]['class'].length;
					classOld = $scope.shopList[i]['class'];
					$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld.slice(0,length-1):classOld);
				}
				getPageData();
				return;
			}
			var firstAll = true;
			var length1= 0,classOld1="";
			for(var i=0;i<$scope.shopList.length;i++){
				length1 = $scope.shopList[i]['class'].length;
				classOld1 = $scope.shopList[i]['class'];
				firstAll = firstAll&&(classOld1.charAt(length1-1)!='L');
			}
			if(firstAll){
				for(var i=0;i<$scope.shopList.length;i++){
					length = $scope.shopList[i]['class'].length;
					classOld = $scope.shopList[i]['class'];
					if($scope.shopList[i].name==name){
					// console.log(name);
						$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld.slice(0,length-1):classOld);
					}else{
						$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld:classOld+'L');
					}
				}
				getPageData();
				return;
			}
			for(var i=0;i<$scope.shopList.length;i++){
			 if($scope.shopList[i].name==name){
				$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld.slice(0,length-1):classOld+"L");
			 }
			}
			getPageData();
		};
		$scope.switchCate = function(name,classOld){
			$scope.currentPage = 0;
			for(var i=0;i<$scope.cateList.length;i++){
				if($scope.cateList[i].key==name){
					$scope.cateList[i]['class'] = (classOld=='checked'?'':'checked');
				}
			}
			getPageData();
		};
		$scope.showUpdate = function(updateTime){
			var oldDate = new Date(updateTime);
			var today = new Date();
			console.log(updateTime);
			var t = (today-oldDate)/60000||0;
			if(t>1440){
				return (parseInt(t/1440)+1)+'天前';
			}else if(t>60){
				return (parseInt(t/60)+1)+'小时前';
			}else{
				return (parseInt(t)+1)+"分前";
			}
		};
		$scope.shopCate();
    }

})();