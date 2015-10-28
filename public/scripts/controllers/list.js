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
		//show typePanel
		$scope.typePanelClass = "typePanelOpen";
		$scope.switchPanel = function(){
			$scope.typePanelClass = {"typePanelOpen":"typePanelClose","typePanelClose":"typePanelOpen"}[$scope.typePanelClass];
		};
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
				getCateList();
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
			var para = {
				"query":  { 
					"match" : { "title" : $rootScope.searchWords||"" }
				 },
				 "aggs": {
					"website": {
					  "terms": {
						"field": "website"
					  }
					}
				  }
			};
			$http({
				method: 'GET',
				url: 'http://10.182.111.208:9200/uumaiproduct_index/uumaiproduct/_search?search_type=count',
				params: para
			}).success(
				function(data){
					if(data.hits.hits.length<1){
							data.hits.hits = [{"key": 1,"doc_count": 6796},{"key": 2,"doc_count": 6796},{"key": 3,"doc_count": 6796},{"key": 4,"doc_count": 6796},
											{"key": 5,"doc_count": 6796},{"key": 6,"doc_count": 6796},{"key": 7,"doc_count": 6796}];
					}
					$scope.shopList=[];
					for(var i = 0;i<data.hits.hits.length;i++){
						$scope.shopList.push({'name':data.hits.hits[i].key,'class':$scope.getShopClass(data.hits.hits[i].key,true)});
					}
				}
			);
		};
		
		//http request for getting cate list
		var getCateList = function(callback){	
			var para = {
				"query":  { 
								"match" : { "title" : $rootScope.searchWords||"apple iphone" }
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
			$http({
				method: 'GET',
				url: 'http://10.182.111.208:9200/uumaiproduct_index/uumaiproduct/_search?search_type=count',
				params: para
			}).success(
				function(data){
					$scope.cateList=[];
					if(data.hits.hits.length<1){
							data.hits.hits = [{"name": 1,"count": 6796},{"name": 2,"count": 6796},{"name": 3,"count": 6796},{"name": 4,"count": 6796},
											{"name": 5,"count": 6796},{"name": 6,"count": 6796},{"name": 7,"count": 6796}];
					}
					for(var i = 0;i<data.hits.hits.length;i++){
							$scope.cateList.push($.extend(data.hits.hits[i],{'class':'checked'}));
					}
				}
			);
		};
		
		// http request for getting page date
		var getPageData = function(){
			if(!!!$rootScope.searchWords) return;
			var website = [];
			for(var i in $scope.shopList){
				if($scope.shopList[i]['class'].indexOf('IconL')<0){
					website.push($scope.shopList[i].name);
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
			var para = {
				"from" : $scope.currentPage*20||0,
				"size" : 20,
				  "query": {
					"filtered": {
						"query":  { 
								"match" : { "title" : $rootScope.searchWords }
						},
						"filter": {
							"and" : [
								  { "terms": { "website": website}},
								  { "terms": { "instock": [(!!$scope.highFilter?1:0)] }},
								  { "terms": { "ziying": [(!!$scope.lowFilter?1:0)] }}
							 ]
						 }
					}
				},
				"sort": [
				sort,"_score"
			   ]
			};
			console.log(para);
			/*var para = {searchWords : $rootScope.searchWords,
						mailToChina: $scope.highFilter?1:0,
						orderByText : $scope.predicate||'comprehensive',
						currentPage: $scope.currentPage||1,
						shopFilter : [],
						cateFilter : []
			};
			if(!!$scope.lowFilter){para.filterText = $scope.lowFilter;}
			for(var i in $scope.shopList){
				if($scope.shopList[i]['class'].indexOf('IconL')<0){
					para.shopFilter.push($scope.shopList[i].name);
				}
			}
			for(var i in $scope.cateList){
				if($scope.cateList[i]['class']=='checked'){
					para.cateFilter.push($scope.cateList[i].name);
				}
			}
			*/
			$http({
				method: 'GET',
				url: 'http://10.182.111.208:9200/uumaiproduct_index/uumaiproduct/_search',
				params: para
			}).success(
				function(data){
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
				}
			);
		};

		// event listener
		$scope.handleEvent = function (e) {
            $scope.data.columnColor = e.type == "mouseover" ? "Green" : "Blue";
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
				if($scope.cateList[i].name==name){
					$scope.cateList[i]['class'] = (classOld=='checked'?'':'checked');
				}
			}
			getPageData();
		};
		getCateList();
		getShopList();
    }

})();