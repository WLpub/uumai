(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.controller('SearchCtrl', SearchCtrl);

	function SearchCtrl($rootScope, $scope, $window,$location){

		$scope.goToList = function(){
			if(angular.isUndefined($scope.searchWords)){
				$scope.searchWords = " ";
			}
			$rootScope.searchWords = $scope.searchWords;
			$location.path('/list');
		};
		$scope.enterSearchWord = function(event){
			if(event.keyCode !== 13) return;
			$scope.goToList(); 
		};
		$scope.goToHistory = function(){
			if(angular.isUndefined($scope.searchprdidurl)){
				$scope.searchprdidurl = " ";
			}
			if($scope.searchprdidurl.startsWith("https")){
				$scope.searchprdidurl="http"+$scope.searchprdidurl.substring(5,$scope.searchprdidurl.length);
			}
 			$rootScope.searchprdidurl = $scope.searchprdidurl;
			//alert($scope.searchprdidurl);
 			$window.open("/chromeextservice?traceurl="+$scope.searchprdidurl, '_blank');
		};
		$scope.enterSearchHistory = function(event){
			if(event.keyCode !== 13) return;
			$scope.goToHistory(); 
		}
	}
	
})();