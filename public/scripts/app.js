(function(){
	'use strict';

	angular
		.module('uumaiApp',['ngRoute','ngAnimate', 'chart.js', 'brantwills.paging'])
		.config(config)
		.controller('HeaderCtrl', HeaderCtrl);

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
			.when('/register', {
				templateUrl: 'views/register.html',
				controller: 'RegisterCtrl'
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

	function HeaderCtrl($rootScope, $scope){
 		$scope.noUser = true;

		// init the login user
		$rootScope.currentUser = null;

		// monitor the User statu
		$rootScope.$watch('currentUser', function(){
			if($rootScope.currentUser){
				$scope.currentUser = $rootScope.currentUser.username;
				$scope.noUser = false;
			}else{
				$scope.noUser = true;
				$rootScope.currentUser = null;
			}
		});
		
		$scope.logout = function(){
			$rootScope.currentUser = null;
		}
	}
})();
