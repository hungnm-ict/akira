var mobiCtrl = angular.module('mobiCtrl', []);

mobiCtrl.controller('mainCtrl', function($scope, $http, $routeParams) {
	$scope.degree=$routeParams.degree;
    $scope.course = "Japanese " + angular.uppercase($routeParams.degree);
});

mobiCtrl.controller('subCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('learnCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('pictureCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('wordCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('listenCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('connectCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('choiceCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('translateCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('readCtrl', function($scope, $http, $routeParams) {

});

mobiCtrl.controller('writeCtrl', function($scope, $http, $routeParams) {

});