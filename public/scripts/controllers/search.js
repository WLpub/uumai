(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.controller('SearchCtrl', SearchCtrl);

	function SearchCtrl($rootScope, $scope, $location){

		$scope.goToList = function(){
			if(angular.isUndefined($scope.searchWords)){
				$scope.searchWords = " ";
			}
			$rootScope.searchWords = $scope.searchWords;
			$location.path('/list');
		}
	}
	
})();