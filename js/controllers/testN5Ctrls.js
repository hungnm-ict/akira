var appCtrls = angular.module('testN5Ctrls', []);

appCtrls.controller('mainCtrl', function($scope, $location) {
    $scope.type = 1;
    $scope.time = 10;
    $scope.modular = "moduleCtrl: Scope";
    $scope.play = function() {
        $location.path('/game/' + $scope.type + '/' + $scope.time);
    }

    $scope.change = function(key, val) {
        if (key == 1) {
            $scope.type = val;
        } else if (key == 2) {
            $scope.time = val;
        }
    }
});


appCtrls.controller('gameCtrl', function($scope, $location, $stateParams) {
    $scope.type = $stateParams.type;
    $scope.time = $stateParams.min;
    $scope.dataset= [1,10,2,3,4,5,6];
});
