var commonApp = angular.module('commonCtrls', []);


commonApp.controller('menuCtrl', function($scope, $routeParams, $rootScope) {
    $scope.navgroup = $scope.$parent.navgroup;
    $scope.nav = $scope.$parent.nav;
});
