(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.controller('DetailCtrl', DetailCtrl);

	function DetailCtrl($scope, ItemDetail){
		$scope.item = ItemDetail;
		ItemDetail.getData().success(function(data) {
		    $scope.item = data;
		    $scope.labels = data.priceTrend.dates;
			$scope.data = [data.priceTrend.prices];
		});
	}
})();