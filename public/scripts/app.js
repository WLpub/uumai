(function(){
	'use strict';

	angular
		.module('uumaiApp',['ngRoute','ngAnimate', 'chart.js', 'brantwills.paging'])
		.config(config);

	function config($routeProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'views/search.html',
				controller: 'SearchCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/list', {
				templateUrl: 'views/list.html',
				controller: 'ListCtrl'
			})
			.when('/detail/:pid', {
				templateUrl: 'views/detail.html',
				controller: 'DetailCtrl'
			})
			.otherwise({ redirectTo: '/' });
	}
})();
