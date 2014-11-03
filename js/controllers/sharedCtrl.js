var commonApp = angular.module('commonCtrls', ['akrUtilService']);

commonApp.controller('menuCtrl', function($scope, menuFactory, $rootScope, utilService) {
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

    $scope.globalLang = function(langCode) {
        changeLang(langCode)
        $rootScope.$broadcast('siteLangChanged', {lang:langCode} );
    }
});
