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
			
			$scope.currentPage = page;
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
			}
			$rootScope.searchWords = $scope.searchWords;
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
		$scope.$watch('highFilter + lowFilter + predicate', function(a,b){
			getPageData();
		});
		
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
							$scope.cateList.push($.extend(data.aggregations.category.buckets[i],{'class':'checked'}));
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
					sort  = { "price": { "order": "desc" }};
				break;
				case '-price':
					sort  = { "price": { "order": "asc" }};
				break;
				case 'customerreview':
					sort  = { "customerreview": { "order": "desc" }};
				break;
				case '-customerreview':
					sort  = { "customerreview": { "order": "asc" }};
				break;
			}
			var and = [
					{ "terms": { "instock": [(!!$scope.highFilter?1:1)] }}
					//{ "terms": { "ziying": [(!!$scope.lowFilter?1:1)] }}
			];
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
                           "minimum_should_match": "75%"
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
		$scope.shopName = {'1':'亚马逊','2':'当 当网','3':'国美 电器','4':'京东商城','5':'苏宁电器','6':'一 号店','7':'易迅'};
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
			if(type==0){
				for(var i=0;i<$scope.shopList.length;i++){
					length = $scope.shopList[i]['class'].length;
					classOld = $scope.shopList[i]['class'];
					$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld:classOld+"L");
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
			for(var i=0;i<$scope.shopList.length;i++){
			 if($scope.shopList[i].name==name){
				$scope.shopList[i]['class'] = (classOld.charAt(length-1)=='L'?classOld.slice(0,length-1):classOld+"L");
			 }
			}
			getPageData();
		};
		$scope.switchCate = function(name,classOld){
			for(var i=0;i<$scope.cateList.length;i++){
				if($scope.cateList[i].key==name){
					$scope.cateList[i]['class'] = (classOld=='checked'?'':'checked');
				}
			}
			getPageData();
		};
    }

})();