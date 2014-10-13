var commonApp = angular.module('commonCtrls', []);


commonApp.controller('menuCtrl', function($scope) {
    // switch($route.current.params.degree){
    // case "n5":
    // $scope.navgroup= 0;
    // break;
    // case "n4":
    // $scope.navgroup= 1;
    // break;

    // }
    $scope.navgroup = $scope.$parent.navgroup;
    $scope.nav = $scope.$parent.nav;

    $scope.menuClick = function(navgroup, nav) {
        $scope.navgroup = navgroup;
        $scope.nav = nav;
    }
});
