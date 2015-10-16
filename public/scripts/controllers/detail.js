 $(function () { 
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
});
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