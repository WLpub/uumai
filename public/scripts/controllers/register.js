(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.directive('ngFocus', [function() {
			var FOCUS_CLASS = "ng-focused";
			return {
			    restrict: 'A',
			    require: 'ngModel',
			    link: function(scope, element, attrs, ctrl) {
			      	ctrl.$focused = false;
			      	element.bind('focus', function(evt) {
			        	element.addClass(FOCUS_CLASS);
			        	scope.$apply(function() {ctrl.$focused = true;});
			      	}).bind('blur', function(evt) {
			        	element.removeClass(FOCUS_CLASS);
			        	scope.$apply(function() {ctrl.$focused = false;});
			      	});
			    }
			}
		}])
		.directive('myPwdMatch', [function(){  
		    return {  
		        restrict: "A",  
		        require: 'ngModel',  
		        link: function(scope,element,attrs,ctrl){  
		            var tageCtrl = scope.$eval(attrs.myPwdMatch);  
		            tageCtrl.$parsers.push(function(viewValue){  
		                ctrl.$setValidity('pwdmatch', viewValue == ctrl.$viewValue);  
		                return viewValue;  
		            });  
		            ctrl.$parsers.push(function(viewValue){  
		                if(viewValue == tageCtrl.$viewValue){  
		                    ctrl.$setValidity('pwdmatch', true);  
		                    return viewValue;  
		                } else{  
		                    ctrl.$setValidity('pwdmatch', false);  
		                    return undefined;  
		                }  
		            });  
		        }  
		    };  
		}])
		.controller('RegisterCtrl', RegisterCtrl);

	function RegisterCtrl($scope, $http, $timeout, $location){
		// message tips
		$scope.showMsg = false;
		
		// switch register && sms vertify
		$scope.registerStage = true;

		// register form information
		$scope.currentUser = {
			username: "",
			email: "",
			password: "",
			mobilePhoneNumber: ""
		};

		// sms code information
		$scope.sms = {
			mobilePhoneNumber : "",
			codeNumber : ""
		}

		$scope.smsStatu = false;

		// http header init
		$http.defaults.headers.common['X-AVOSCloud-Application-Id'] = "ob4mro7jghfohtktipzmds0x01ur7uicrjvme7spnrtxh2b3";
		$http.defaults.headers.common['X-AVOSCloud-Application-Key'] = "kp0jaoa5f0b9ayth4ceypk3r3byxbcsm1jw3bckyvnvlthwv";

		//register a new user
		$scope.submitRegister = function(){
			// register
			$http({
				method: 'POST',
				url: 'https://api.leancloud.cn/1.1/users',
				data: $scope.currentUser
			}).success(function(){
				// keep mobile phone number for vertify
				$scope.sms.mobilePhoneNumber = $scope.currentUser.mobilePhoneNumber;
				
				// show tips 
				$scope.isSuccess = true;
				$scope.messageText = "注册成功,请前往邮箱确认！";
				$scope.showMsg = true;

				// switch to sms code vertify form
				$scope.registerStage = false;
				
			}).error(function(data){
				$scope.isSuccess = false;
				$scope.messageText = data.error;
				$scope.showMsg = true;
			});

			return false;
		};


		// get sms code again
		$scope.getMSN = function(){
			$http({
				method: 'POST',
				url: 'https://api.leancloud.cn/1.1/requestMobilePhoneVerify',
				data: {
					mobilePhoneNumber : $scope.currentUser.mobilePhoneNumber
				}
			}).success(function(){
				$scope.smsStatu = true;
				$scope.isSuccess = true;
				$scope.messageText = "验证码已发送！";
				$scope.showMsg = true;
				$timeout(function(){
					$scope.smsStatu = false;
				},5000);
			}).error(function(data){
				$scope.isSuccess = false;
				$scope.messageText = data.error;
				$scope.showMsg = true;
			});

			return false;
		};

		// vertity the  sms code for mobile phone
		$scope.submitVertifySmsCode = function(){
			$http({
				method : 'POST',
				url: 'https://api.leancloud.cn/1.1/verifyMobilePhone/' + $scope.sms.codeNumber
			}).success(function(){
				//show tips
				$scope.isSuccess = true;
				$scope.messageText = "手机号验证成功！";
				$scope.showMsg = true;
				//jump to login page
				$timeout(function(){
					$location.path('/login');
				}, 3000);
			}).error(function(data){
				$scope.isSuccess = false;
				$scope.messageText = data.error;
				$scope.showMsg = true;
			});

			return false;
		}
	}
})();