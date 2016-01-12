(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.constant('tipsTypeSuccess', 'alert-success')
		.constant('tipsTypeError', 'alert-danger')
		.constant('tipsTypeWarnging', 'alert-warning')
		.controller('LoginCtrl', LoginCtrl);

	function LoginCtrl($scope, $http, $rootScope, $location){
		// init the login table
		$scope.loginMethod = "手机验证码登陆";
		$scope.usernameType = "用户名/邮箱";
		$scope.needPhone = true;
		
		$scope.changeLoginMethod = function(){
			if($scope.needPhone == true){
				$scope.userIdentity.username = "";
				$scope.userIdentity.password = "";
				
				$scope.loginMethod = "普通登陆";
				$scope.usernameType = "手机号";
				$scope.needPhone = false;
			}else{
				$scope.userIdentity.username = "";
				$scope.userIdentity.password = "";
				
				$scope.loginMethod = "手机验证码登陆";
				$scope.usernameType = "用户名/邮箱";
				$scope.needPhone = true;
			}
		}

		// http header init
		$http.defaults.headers.common['X-AVOSCloud-Application-Id'] = "s1s01ktw7ua0pv08pp39pp2kbjf0qvl5m2xckjj62lyzym31";
		$http.defaults.headers.common['X-AVOSCloud-Application-Key'] = "g5y8p8bbcxliay9xav9pwb6r9oknp4zrqltjxyjkei38ej6f";

		// init the login info
		$scope.userIdentity = {
			username : "",
			password : ""
		};

		$scope.login = function(){
			if( $scope.needPhone == true){
				$http({	// commmon login
					method: 'GET',
					url: 'https://cn.avoscloud.com/1.1/login',
					params : $scope.userIdentity
				}).success(function(data){
					//show tips
					$scope.isSuccess =  true;
					$scope.messageText = data.username + ", 欢迎您";
					// keep user
					$rootScope.currentUser = data;
					$location.path('/list');
				}).error(function(data){
					$scope.isSuccess =  false;
					$scope.messageText = data.error;
				});	
			}else{	// login through phone numver
				$http({
					method: 'POST',
					url: 'https://api.leancloud.cn/1.1/login',
					data: {
						mobilePhoneNumber : $scope.userIdentity.username,
						smsCode : $scope.userIdentity.password
					}
				}).success(function(data){
					// show tips
					$scope.isSuccess =  true;
					$scope.messageText = data.username + ", 欢迎您";
					// keep user
					$rootScope.currentUser = data;
					$location.path('/list');
				}).error(function(data){
					$scope.isSuccess =  false;
					$scope.messageText = data.error;
				});	
			}

			return false;
		};

		$scope.getTextCode = function(){
			$http({
				method: 'POST',
				url: 'https://api.leancloud.cn/1.1/requestLoginSmsCode',
				data : {
					mobilePhoneNumber : $scope.userIdentity.username
				}
			}).success(function(data){
				$scope.isSuccess =  true;
				$scope.messageText = "验证码已发送成功!";
			}).error(function(data){
				$scope.isSuccess =  false;
				$scope.messageText = data.error;
			});	

			return false;
		}

	}
})();