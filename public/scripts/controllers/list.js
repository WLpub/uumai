(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.constant('goodsOrderActiveClass', 'btn-success')
		.constant('goodsViewActiveClass', 'orange')
		.controller('ListCtrl', ListCtrl);

	function ListCtrl($scope, $http, $rootScope, goodsOrderActiveClass, goodsViewActiveClass){
		//order by
		$scope.goodsOrder = [{
			type: "comprehensive",
			name: "综合排序"
		},{
			type: "listprice",
			name: "价格"
		},{
			type: "star",
			name: "客户评级"
		},{
			type: "customerreviews",
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
			console.log(order);
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
			var para = {searchWords : $rootScope.searchWords,
						mailToChina: $scope.highFilter?1:0
			};
			if(!!$scope.lowFilter){para.filterText = $scope.lowFilter;}
			$http({
				method: 'GET',
				url: '/shopList',
				params: para
			}).success(
				function(data){
					$scope.shopList=[];
					for(var i = 0;i<data.length;i++){
							$scope.shopList.push({'name':data[i],'class':$scope.getShopClass(data[i],true)});
					}
				}
			);
		};
		
		//http request for getting cate list
		var getCateList = function(callback){	
			var para = {searchWords : $rootScope.searchWords,
						mailToChina: $scope.highFilter?1:0
			};
			if(!!$scope.lowFilter){para.filterText = $scope.lowFilter;}
			$http({
				method: 'GET',
				url: '/cateList',
				params: para
			}).success(
				function(data){
					$scope.cateList=[];
					for(var i = 0;i<data.length;i++){
							$scope.cateList.push($.extend(data[i],{'class':'checked'}));
					}
				}
			);
		};
		
		// http request for getting page date
		var getPageData = function(){
			if(!!!$rootScope.searchWords) return;
			
			var para = {searchWords : $rootScope.searchWords,
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
			console.log(para);
			$http({
				method: 'GET',
				url: '/list',
				params: para
			}).success(
				function(data){

					$scope.goodBlocks = data;
					
					$scope.total = data.total;
					
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
			);
		};

		// event listener
		$scope.handleEvent = function (e) {
            $scope.data.columnColor = e.type == "mouseover" ? "Green" : "Blue";
		};
		
		//get shop Class
		$scope.getShopClass = function(shop,state){
			var shopClass = {
				'taobao':{true:'taobaoIcon',false:'taobaoIconL'},
				'amazon':{true:'amazonIcon',false:'amazonIconL'},
				'JD':{true:'JDIcon',false:'JDIconL'},
				'suning':{true:'suningIcon',false:'suningIconL'},
				'apple':{true:'appleIcon',false:'appleIconL'}};
		
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