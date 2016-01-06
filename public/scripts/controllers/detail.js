(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.controller('DetailCtrl', DetailCtrl);

	function DetailCtrl($scope,$rootScope,$location, ItemDetail){
		$scope.item = ItemDetail;
		ItemDetail.getData().success(function(data) {
		    $scope.item = data;
		    $scope.labels = data.priceTrend.dates;
			$scope.data = [data.priceTrend.prices];
			$('#container1').highcharts({
				chart: {
					type: 'line'
				},
				title: {
					text: '价格走势'
				},
				yAxis: {
					title: {
						text: '历史价格'
					}
				},
				series: [{
					name:'价格',
					data: [1, 0, 4]
				}],
				credits: {
            	text: '',
            	href: ''
				}
			});
		});
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
		}
	}
})();