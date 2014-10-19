var ctrls= angular.module('profileCtrl',[]);

ctrls.controller('main', function($scope){
	$scope.data = getUser();
});