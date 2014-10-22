var commonApp = angular.module('commonCtrls', []);

commonApp.controller('menuCtrl', function($scope, menuFactory, $rootScope) {
    $scope.navgroup = menuFactory.navgroup;
    $scope.nav = menuFactory.nav;

    $scope.$on('handleBroadcast', function() {
        $scope.navgroup = menuFactory.navgroup;
        $scope.nav = menuFactory.nav;
    });

    $scope.menuClick = function(navgroup, nav) {
        menuFactory.navgroup = navgroup;
        menuFactory.nav = nav;
        $rootScope.$broadcast('handleBroadcast');
    };
});


// commonApp.service('ultiService', function ($http,$scope) {
//     $scope.trans = function(e){
//         return "transevice";
//     }
// });