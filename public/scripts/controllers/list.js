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
			type: "price",
			name: "价格"
		},{
			type: "sales",
			name: "销量"
		},{
			type: "comments",
			name: "评论数"
		}];
		$scope.resetOrder = function(order){
			if( $scope.predicate == order){
				$scope.predicate = "-" + order;
			}else{
				$scope.predicate = order;
			}
		}
		$scope.setSelectedClass = function(type){
			if ( $scope.predicate == type || $scope.predicate == "-"+type ){
				return goodsOrderActiveClass;
			}else{
				return "";
			}
		}

		//list or table
		$scope.showBlock = false;
		$scope.showList = true;
		$scope.viewType = "list";
		$scope.showGoods = function(type){
			if( type == "block" ){
				$scope.showBlock = true;
				$scope.showList = false;
				$scope.viewType = "block";
			}else{
				$scope.showBlock = false;
				$scope.showList = true;
				$scope.viewType = "list";
			}
		}
		$scope.setView = function(type){
			return $scope.viewType == type? goodsViewActiveClass : "";
		}

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
			//var url = 'data/list.json';
			var url = '/list';
			var params = [{
				searchWords: $rootScope.searchWords,
				filterText : $scope.highFilter + " " +$scope.lowFilter,
				orderByText : $scope.predicate,
				page: page,
				pageSize: pageSize
			}]
			getPageData(url, params);
		}

		//search new good
		$scope.searchGoods = function(){
			$rootScope.searchWords = $scope.searchWords;
			//getPageData('data/list.json', [{
			getPageData('/list', [{
				searchWords : $rootScope.searchWords
			}]);
		}

		//filter && loading Page
		$scope.highFilter = false;
		$scope.lowFilter = null;
		$scope.$watch('highFilter + lowFilter', function(){
			//getPageData('data/list.json',[{
			getPageData('/list',[{
				searchWords : $rootScope.searchWords,
				filterText : $scope.highFilter + " " +$scope.lowFilter,
				orderByText : $scope.predicate
			}]);
		});

		// http request for getting page date
		function getPageData(url, params){
			$http({
				method: 'GET',
				url: url,
				params: params
			}).success(
				function(data){
					$scope.goodBlocks = data;
					$scope.searchWords = $rootScope.searchWords;
					// init paging
					$scope.currentPage = data.currentPage;
					$scope.pageSize = data.pageSize;
					$scope.total = data.total;
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
		}

		// event listener
		$scope.handleEvent = function (e) {
            console.log("Event type: " + e.type);
            $scope.data.columnColor = e.type == "mouseover" ? "Green" : "Blue";
		}

    }

})();