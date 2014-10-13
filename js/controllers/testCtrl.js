var appCtrls = angular.module('testCtrls', []);

appCtrls.controller('mainCtrl', function($scope, $routeParams, $location, menuFactory,$rootScope) {
    $scope.courseCollection = ["common.vocab", "common.grammar", "common.read", "common.listen-compre"];
    $scope.courseSelectedIndex = 0;
    $scope.timeCollection = ["10", "20", "30"];
    $scope.timeSelectedIndex = 0;
    $scope.type = 0;
    $scope.time = 10;
    switch ($routeParams.degree) {
        case "n4":
            menuFactory.navgroup = 1;
            menuFactory.nav = 2;
            break;
        case "n5":
            menuFactory.navgroup = 0;
            menuFactory.nav = 2;
            break;
    }
    $rootScope.$broadcast('handleBroadcast');

    $scope.play = function() {
        $location.path('/' + $routeParams.degree + '/' + $scope.type + '/' + $scope.time);
    }

    $scope.change = function(selectedType, selectedIndex) {
        if (selectedType == 1) {
            $scope.courseSelectedIndex = selectedIndex;
            $scope.type = selectedIndex;
        } else if (selectedType == 2) {
            $scope.timeSelectedIndex = selectedIndex;
            $scope.time = 10 * selectedIndex + 10;
        }
    }
});


appCtrls.controller('gameCtrl', function($scope, $routeParams, $http, dataService, data) {

    courseCollection = ["common.vocab", "common.grammar", "common.read", "common.listen-compre"];
    $scope.title = courseCollection[$routeParams.type];

    switch ($routeParams.degree) {
        case "n4":
            $scope.$parent.navgroup = 1;
            $scope.$parent.nav = 2;
            break;
        case "n5":
            $scope.$parent.navgroup = 0;
            $scope.$parent.nav = 3;
            break;
        default:
            $scope.$parent.navgroup = 0;
            $scope.$parent.nav = 3;
            break;
    }

    $scope.type = $routeParams.type;
    $scope.time = $routeParams.min;
    $scope.dataset = dataService.genDataSet(data, $routeParams.type, $routeParams.min);
});
