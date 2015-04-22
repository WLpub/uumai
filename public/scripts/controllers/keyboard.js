(function(){
	'use strict';

	angular
		.module('uumaiApp')
		.directive('dateKeys', [function () {
			return {
				restrict: 'A',
				link: function (scope, iElement, iAttrs) {
					debugger;
					iElement.on('keydown', function(event) {
						if(event.keyCode == 13){
							return true;
						}
						return false;
					})
				}
			};
		}])
})();