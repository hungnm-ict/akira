var appCtrls = angular.module('totalCtrls', []);

appCtrls.controller('mainCtrl', function($scope, $location) {
    $scope.type = 1;
    $scope.time = 10;
    $scope.modular = "moduleCtrl: Scope";
    $scope.play = function(type, time) {
        alert($scope.type + "|" + $scope.time);
        $location.path("game/{{$scope.type}}/{{$scope.time}}");
    }

    $scope.change = function(key, val) {
        alert("change called!!!!!");
        $scope.type = val;
    }
});


appCtrls.controller('gameCtrl', function($scope) {
    $scope.modular = "moduleCtrl: Scope";
});

appCtrls.controller('menuCtrl', function($scope) {
    $scope.v = "Hello from controller A";
    $scope.hi = function() {
        console.log('hi');
    };

});
