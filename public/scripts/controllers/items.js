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
			return $http.get('/detail/'+ $routeParams.pid)
				.success(function(response){
					return response.data;
	        	});
		}
	}
})();