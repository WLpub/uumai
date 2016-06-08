(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.controller('DetailCtrl', DetailCtrl);

	function DetailCtrl($scope,$rootScope,$location, ItemDetail){
		$scope.item = ItemDetail;
		ItemDetail.getData().success(function(data) {
		    $scope.item = data;
		    $scope.labels = data.priceTrendtime;
			$scope.pricedata =  data.priceTrend;
			$('#container1').highcharts({
				   chart: {
			            type: 'line'
			        },
			        title: {
						text: '价格走势'
					},
			        xAxis: {
			            categories: $scope.labels
			        },
			        yAxis: {
			            title: {
			                text: 'RMB'
			            }
			        },
					credits: {
		            	text: '',
		            	href: ''
						},
			        series: [{
			        	name:'价格',
			            data: $scope.pricedata
			        }]
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