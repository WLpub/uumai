(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.factory('ItemDetail', ItemDetail);

	function ItemDetail($http, $routeParams){
		return {
			getData : getData
		}
		function getData(){
			return $http.get('data/detail'+ $routeParams.pid + '.json')
				.success(function(response){
					return response.data;
	        	});
		}
	}
})();