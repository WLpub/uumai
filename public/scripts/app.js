(function(){
	'use strict';

	angular
		.module('uumaiApp',['ngCookies','ngRoute','ngAnimate', 'chart.js', 'brantwills.paging'])
		.config(cookiesConfig)
		.config(config)
		.controller('HeaderCtrl', HeaderCtrl);

    // cookiesConfig.$inject = ['$cookiesProvider']
    // HeaderCtrl.$inject = ['$cookies'];

    
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

	function cookiesConfig($cookiesProvider){
	    var date = new Date();
	    date.setDate(date.getDate() + 100);
	    var expires = date;
	    // console.log(expires);
	    $cookiesProvider.expires = expires;
	}

	// function HeaderCtrl($cookies){	
 	function HeaderCtrl($cookieStore, $scope, $rootScope ,$location){
 		console.log('dd');
	    // $scope.noUser = true;

		// init the login user
		// $scope.currentUser = null;

		var currentuserdata=$cookieStore.get('currentUser');
		console.log(currentuserdata);
		if(currentuserdata!=null){
			$scope.currentUser = currentuserdata.username;
			$scope.noUser = false;
		}else{
			// // monitor the User statu
			$rootScope.$watch('currentUser', function(){
				if($rootScope.currentUser){
					$scope.currentUser = $rootScope.currentUser.username;
					$scope.noUser = false;
				}else{
					$scope.noUser = true;
					$scope.currentUser = null;
				}
			});
			
		}


		$scope.logout = function(){
		    $rootScope.currentUser = null;
			$cookieStore.remove('currentUser');
			$scope.noUser = true;
			$scope.currentUser = null;
			//jump to login page
			// $location.path('/');
		}
	}
})();
